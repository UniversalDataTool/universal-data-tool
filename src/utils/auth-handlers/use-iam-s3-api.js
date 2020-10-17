import { useMemo } from "react"
import { useAppConfig } from "../../components/AppConfig"
import xmlParser from "fast-xml-parser"
import useIsDesktop from "../../hooks/use-is-desktop"
import { AwsClient } from "aws4fetch"

function parseS3URI(s3Path) {
  const bucket = s3Path.match(/s3:\/\/([^/]+)/)[1]
  const path = s3Path.replace(/s3:\/\/[^/]+\//, "")
  return { bucket, path }
}

export default () => {
  const { appConfig } = useAppConfig()
  const isDesktop = useIsDesktop()
  let {
    "auth.s3iam.accessKeyId": accessKeyId,
    "auth.s3iam.secretAccessKey": secretAccessKey,
    "auth.s3iam.region": region,
    "auth.proxy.corsproxy": corsProxy,
  } = appConfig
  if (isDesktop) {
    corsProxy = "{URL}"
  }
  // TODO if electron don't use CORS proxy

  const awsClient = useMemo(
    () =>
      accessKeyId
        ? new AwsClient({ accessKeyId, secretAccessKey, region, service: "s3" })
        : null,
    // eslint-disable-next-line
    []
  )

  const fetchS3 = async (url, opts = {}) => {
    const request = await awsClient.sign(url, opts)
    const corsProxyRequest = new Request(
      corsProxy.replace("{URL}", encodeURIComponent(request.url)),
      {
        headers: request.headers,
        method: request.method,
        body: opts.body,
      }
    )
    const response = await fetch(corsProxyRequest).then((r) => r.text())
    return xmlParser.parse(response)
  }

  if (!accessKeyId) return {}

  return useMemo(
    () => ({
      parseS3URI,
      listBuckets: () => fetchS3("https://s3.amazonaws.com"),
      listBucketItemsAt: (s3Path, opts = {}) => {
        const { bucket, path } = parseS3URI(s3Path)
        return fetchS3(
          `https://s3.${region}.amazonaws.com/${bucket}?list-type=2&delimiter=/&prefix=${path}`,
          {
            headers: { Host: bucket },
          }
        )
      },
      putBucketItem: async (s3Path, file) => {
        const { bucket, path } = parseS3URI(s3Path)
        const res = await fetchS3(
          `https://s3.${region}.amazonaws.com/${bucket}/${path}`,
          {
            method: "PUT",
            headers: {
              Host: `s3.amazonaws.com/${bucket}`,
              "Content-Type": file.type,
              "x-amz-acl": "public-read",
            },
            body: file,
          }
        )
        if (res.Error) {
          throw new Error(`${res.Error.Code}: ${res.Error.Message}`)
        }
        return res
      },
    }),
    // eslint-disable-next-line
    [awsClient]
  )
}
