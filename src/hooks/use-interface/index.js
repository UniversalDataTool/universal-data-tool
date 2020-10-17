import useDatasetProperty from "../use-dataset-property"

export default () => {
  const ret = useDatasetProperty("interface")
  ret.iface = ret.interface
  return ret // { interface, iface, updateInterface, interfaceLoading }
}
