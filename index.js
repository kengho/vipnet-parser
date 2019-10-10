const id = (args) => {
  let workingString
  let array
  let threshold
  let onlyUnuq = true
  if (typeof args === 'string') {
    workingString = args
    array = []
  } else if (typeof args === 'object') {
    ({ string: workingString, array, threshold, onlyUnuq } = args)
  } else {
    return []
  }
  array = array || []
  workingString = workingString.toLowerCase()

  const cyrillicSub = [
    ['а', 'a'], ['б', 'b'], ['В', 'b'], ['с', 'c'], ['д', 'd'], ['е', 'e'], ['ф', 'f'],
    ['А', 'a'], ['Б', 'b'], ['в', 'b'], ['С', 'c'], ['Д', 'd'], ['Е', 'e'], ['Ф', 'f'],
  ]

  cyrillicSub.forEach(([cyr, lat]) => {
    workingString = workingString.replace(new RegExp(cyr, 'g'), lat)
  })

  const regexps = [
    [/(.*)(0x[0-9a-f]{1,8}-0x[0-9a-f]{1,8})(.*)/s, idParseVariant1],
    [/(.*)([0-9a-f]{8})(.*)/s, idParseVariant2],
    [/(.*)0x([0-9a-f]{1,8})(.*)/s, idParseVariant3],
  ]

  let stringMatchesAnything = false
  regexps.forEach(([regexp, callback]) => {
    if (stringMatchesAnything) {
      return
    }
    const match = workingString.match(regexp)
    if (!match) {
      return
    }
    stringMatchesAnything = true

    // Preserving original order.
    array.push(...id({ string: match[1], threshold }))
    array.push(...callback({ string: match[2], threshold }))
    array.push(...id({ string: match[3], threshold }))
    workingString = workingString.replace(match[2], '')
  })

  if (!stringMatchesAnything) {
    return []
  }

  const uniq = (value, index, self) => {
    return (self.indexOf(value) === index)
  }

  if (onlyUnuq) {
    return array.filter(uniq)
  } else {
    return array
  }

  return array
}

// Modified leftJustify() from here:
// https://gist.github.com/biesiad/889139#file-stringjustify-js
const rjust = (string, length, char) => {
  var fill = []
  while (fill.length + string.length < length) {
    fill[fill.length] = char
  }
  return fill.join('') + string
}

const idParseVariant1 = (args) => {
  const { string, threshold } = args

  const regexp = /0x([0-9a-f]{1,8})-0x([0-9a-f]{1,8})/
  const match = string.match(regexp)

  const intervalBegin = parseInt(match[1], 16)
  const intervalEnd = parseInt(match[2], 16)

  if ((typeof threshold === 'number') && (intervalEnd - intervalBegin + 1 > threshold)) {
    return []
  }

  const array = []
  for (let i = intervalBegin; i <= intervalEnd; i += 1) {
    array.push(`0x${rjust(i.toString(16), 8, '0')}`)
  }

  return array
}

const idParseVariant2 = (args) => {
  const string = args.string
  return ['0x' + string]
}

const idParseVariant3 = (args) => {
  const string = args.string
  return ['0x' + rjust(string, 8, '0')]
}

const network = (nodeId) => {
  const normalIds = id(nodeId)
  if (normalIds.length === 0) {
    return 0xffff.toString(10)
  }

  const normalId = normalIds[0]

  //   2   6
  // 0123456789
  // 0x1a0eabcd  <== nodeId
  // =>1a0e      <== hex network number
  const networkIndexA = 2
  const networkIndexB = 6
  return parseInt(normalId.substring(networkIndexA, networkIndexB), 16).toString(10)
}

module.exports = {
  id,
  network,
}
