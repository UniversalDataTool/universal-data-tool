import { useMemo } from "react"
import { useAppConfig } from "../../components/AppConfig"
import xmlParser from "fast-xml-parser"
import useIsDesktop from "../use-is-desktop"
import { AwsClient } from "aws4fetch"

export default () => {
  const { appConfig } = useAppConfig()
  const isDesktop = useIsDesktop()
  let {
    "auth.s3iam.access_key_id": accessKeyId,
    "auth.s3iam.secret_access_key": secretAccessKey,
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

  const fetchS3 = async (url, opts) => {
    const request = await awsClient.sign(url, opts)
    const corsProxyRequest = new Request(
      corsProxy.replace("{URL}", encodeURIComponent(request.url)),
      request
    )
    const response = await fetch(corsProxyRequest).then((r) => r.text())
    return xmlParser.parse(response)
  }

  if (!accessKeyId) return null

  return useMemo(
    () => ({
      listBuckets: () => fetchS3("https://s3.amazonaws.com"),
      listBucketItemsAt: (s3Path, opts = {}) => {
        const bucket = s3Path.match(/s3:\/\/([^/]+)/)[1]
        const prefix = s3Path.replace(/s3:\/\/[^/]+\//, "")
        return fetchS3(
          `https://s3.${region}.amazonaws.com/${bucket}?list-type=2&delimiter=/&prefix=${prefix}`,
          {
            headers: { Host: bucket },
          }
        )
      },
    }),
    // eslint-disable-next-line
    [awsClient]
  )
}
