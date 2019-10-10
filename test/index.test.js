const expect = require('chai').expect
const VipnetParser = require('./../index')

it('should get vipnet ids from strings like \'1a0eabcd\'', () => {
  const actualIds = VipnetParser.id('1a0eabcd')
  expect(actualIds).to.deep.equal(['0x1a0eabcd'])
})

it('should drop not uniq ids by default', () => {
  const actualIds = VipnetParser.id('1a0eabcd,1a0eabcd')
  expect(actualIds).to.deep.equal(['0x1a0eabcd'])
})

it('shouldn\'t drop not uniq ids if onlyUnuq flag is set to false', () => {
  const actualIds = VipnetParser.id({ string: '1a0eabcd,1a0eabcd', onlyUnuq: false })
  expect(actualIds).to.deep.equal(['0x1a0eabcd', '0x1a0eabcd'])
})

it('should get vipnet ids from strings like \'1A0EABCD\'', () => {
  const actualIds = VipnetParser.id('1A0EABCD')
  expect(actualIds).to.deep.equal(['0x1a0eabcd'])
})

it('should get vipnet ids from strings like \'something 1A0EABCD something\'', () => {
  const actualIds = VipnetParser.id('something 1A0EABCD something')
  expect(actualIds).to.deep.equal(['0x1a0eabcd'])
})

it('should get vipnet ids from strings like \'0xa0eabcd\'', () => {
  const actualIds = VipnetParser.id('0xa0eabcd')
  expect(actualIds).to.deep.equal(['0x0a0eabcd'])
})

it('should get vipnet ids from strings like \'something 0xa0eabcd something\'', () => {
  const actualIds = VipnetParser.id('something 0xa0eabcd something')
  expect(actualIds).to.deep.equal(['0x0a0eabcd'])
})

it('should get vipnet ids from strings like \'0xa0eabcd-0xa0eabcf\'', () => {
  const actualIds = VipnetParser.id('0xa0eabcd-0xa0eabcf')
  expect(actualIds).to.deep.equal(['0x0a0eabcd', '0x0a0eabce', '0x0a0eabcf'])
})

it('should get vipnet ids from long ranges', () => {
  const actualIds = VipnetParser.id('0xa0e0000-0xa0e0fff')
  expect(actualIds.length).to.equal(0x1000)
})

it('should return empty array while gettings vipent ids from strings like \'0x1a0eabcf-0x1a0eabcd\'', () => {
  const actualIds = VipnetParser.id('0x1a0eabcf-0x1a0eabcd')
  expect(actualIds).to.deep.equal([])
})

it('should return one element while gettings vipent ids from strings like \'0x1a0eabcd-0x1a0eabcd\'', () => {
  const actualIds = VipnetParser.id('0x1a0eabcd-0x1a0eabcd')
  expect(actualIds).to.deep.equal(['0x1a0eabcd'])
})

it('should get vipnet ids from strings like \'something 0xa0eabcd-0xa0eabcf something\'', () => {
  const actualIds = VipnetParser.id('something 0xa0eabcd-0xa0eabcf something')
  expect(actualIds).to.deep.equal(['0x0a0eabcd', '0x0a0eabce', '0x0a0eabcf'])
})

it('should get vipnet ids from multiline multiid string (easy)', () => {
  const actualIds = VipnetParser.id("something 0x1a0eabcd-0x1a0eabcf\nsomething else 0x1a0eabdd")
  expect(actualIds).to.deep.equal(['0x1a0eabcd', '0x1a0eabce', '0x1a0eabcf', '0x1a0eabdd'])
})

it('should get vipnet ids from multiline multiid string (hard)', () => {
  const actualIds = VipnetParser.id("something 0x1a0eabcd-0x1a0eabcf\nsomething else 0x1a0eabdd\n and more 1A0F0001")
  expect(actualIds).to.deep.equal(['0x1a0eabcd', '0x1a0eabce', '0x1a0eabcf', '0x1a0eabdd', '0x1a0f0001'])
})

it('should get vipnet ids from multiline multiid string (nightmare)', () => {
  const actualIds = VipnetParser.id(`
    I would like to thank 0x1a0eabcd-0x1a0eabcf
    also 0x1a0eabdd and
    also 0x1a0eabd0-0x1a0eabd0 and
    and last but not least 1A0F0001, which is my favourite
    forgot about 0xabcd
  `)
  expect(actualIds).to.deep.equal(['0x1a0eabcd', '0x1a0eabce', '0x1a0eabcf', '0x1a0eabdd', '0x1a0eabd0', '0x1a0f0001', '0x0000abcd'])
})

it('shouldn\'t get vipnet ids from strings beyond specified threshold', () => {
  const actualIds = VipnetParser.id({ string: '0x0000-0xffff', threshold: 0xffff })
  expect(actualIds).to.deep.equal([])
})

it('threshold could be 0', () => {
  const actualIds = VipnetParser.id({ string: '0x1a0e0000-0x1a0e00ff', threshold: 0 })
  expect(actualIds).to.deep.equal([])
})

it('should get vipnet ids from strings with cyrillic symbols', () => {
  const actualIds = VipnetParser.id('ВАБЕСДЕФ')
  expect(actualIds).to.deep.equal(['0xbabecdef'])
})

it('should get network id from vipent id', () => {
  const actualNetwork = VipnetParser.network('0x1a0eabcd')
  expect(actualNetwork).to.equal('6670')
})
