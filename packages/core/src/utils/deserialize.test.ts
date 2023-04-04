import { BigNumber } from 'ethers'
import { describe, expect, it } from 'vitest'

import { deserialize } from './deserialize'
import { serialize } from './serialize'

describe('deserialize', () => {
  it('deserializes', () => {
    const deserializedCache = deserialize(
      serialize({
        some: 'complex',
        object: {
          that: 'has',
          many: [
            { many: 'many', manymany: 'many' },
            { many: 'many' },
            { many: 'many' },
            {
              many: {
                properties: {
                  ones: {
                    that: {
                      have: {
                        functions: () => null,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        and: {
          ones: {
            that: {
              have: {
                // TODO(viem-migration): remove bignumber
                bignumbers: BigNumber.from('0x01'),
                bigints: 123456789012345678901234567890n,
              },
            },
          },
        },
        also: {
          ones: {
            that: {
              have: {
                proxies: new Proxy({ lol: 'nice' }, {}),
              },
            },
          },
        },
      }),
    )
    expect(deserializedCache).toMatchInlineSnapshot(`
      {
        "also": {
          "ones": {
            "that": {
              "have": {
                "proxies": {
                  "lol": "nice",
                },
              },
            },
          },
        },
        "and": {
          "ones": {
            "that": {
              "have": {
                "bigints": 123456789012345678901234567890n,
                "bignumbers": {
                  "_hex": "0x01",
                  "_isBigNumber": true,
                },
              },
            },
          },
        },
        "object": {
          "many": [
            {
              "many": "many",
              "manymany": "many",
            },
            {
              "many": "many",
            },
            {
              "many": "many",
            },
            {
              "many": {
                "properties": {
                  "ones": {
                    "that": {
                      "have": {},
                    },
                  },
                },
              },
            },
          ],
          "that": "has",
        },
        "some": "complex",
      }
    `)
  })
})
