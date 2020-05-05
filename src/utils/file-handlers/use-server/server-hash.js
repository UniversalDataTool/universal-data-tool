// This is the same hashing code that the server uses

const stringify = require("json-stable-stringify")

const hashString = (s) => {
  var hash = 0,
    i,
    chr
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

export default (o) => hashString(stringify(o))
