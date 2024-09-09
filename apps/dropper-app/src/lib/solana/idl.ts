import { Idl } from "@coral-xyz/anchor";

export const IDL: Idl = {
  address: "8s9yegeQK6UJPJq25jquj7vQQx6yJJtKZ7CFLjUaj5cL",
  metadata: {
    name: "dropper_giveaway",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "claim_sol_giveaway",
      discriminator: [93, 127, 226, 42, 125, 116, 15, 14],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 111, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "_giveaway_id",
              },
              {
                kind: "arg",
                path: "_creator_key",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "_giveaway_id",
          type: "u64",
        },
        {
          name: "_creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "claim_spl_giveaway",
      discriminator: [108, 91, 213, 43, 222, 80, 140, 197],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "winner_token_accout",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "signer",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "token_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "giveaway_id",
              },
              {
                kind: "arg",
                path: "creator_key",
              },
            ],
          },
        },
        {
          name: "giveaway_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 116, 95,
                  118, 97, 117, 108, 116,
                ],
              },
              {
                kind: "account",
                path: "giveaway",
              },
            ],
          },
        },
        {
          name: "token_mint",
          writable: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "giveaway_id",
          type: "u64",
        },
        {
          name: "creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "create_sol_giveaway",
      discriminator: [100, 209, 153, 18, 18, 220, 177, 38],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "dropper_vault",
          writable: true,
          address: "89LabAxMY6Bn9ak1Uz5LfQZtNybtFhpARatkm7wQHrJE",
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 111, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "options.giveaway_id",
              },
              {
                kind: "account",
                path: "signer",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "options",
          type: {
            defined: {
              name: "CreateSolGiveawayOptions",
            },
          },
        },
      ],
    },
    {
      name: "create_spl_giveaway",
      discriminator: [45, 21, 230, 183, 194, 231, 168, 187],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "dropper_vault",
          writable: true,
          address: "89LabAxMY6Bn9ak1Uz5LfQZtNybtFhpARatkm7wQHrJE",
        },
        {
          name: "token_payer_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "signer",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "token_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "options.giveaway_id",
              },
              {
                kind: "account",
                path: "signer",
              },
            ],
          },
        },
        {
          name: "giveaway_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 116, 95,
                  118, 97, 117, 108, 116,
                ],
              },
              {
                kind: "account",
                path: "giveaway",
              },
            ],
          },
        },
        {
          name: "token_mint",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "options",
          type: {
            defined: {
              name: "CreateSplGiveawayOptions",
            },
          },
        },
      ],
    },
    {
      name: "payout_sol_giveaway",
      discriminator: [161, 210, 228, 214, 80, 72, 166, 198],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "winner_account",
          writable: true,
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 111, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "_giveaway_id",
              },
              {
                kind: "arg",
                path: "_creator_key",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "_giveaway_id",
          type: "u64",
        },
        {
          name: "_creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "payout_spl_giveaway",
      discriminator: [196, 35, 147, 172, 80, 106, 25, 130],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "winner_account",
          writable: true,
        },
        {
          name: "winner_token_accout",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "winner_account",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "token_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "giveaway_id",
              },
              {
                kind: "arg",
                path: "creator_key",
              },
            ],
          },
        },
        {
          name: "giveaway_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 116, 95,
                  118, 97, 117, 108, 116,
                ],
              },
              {
                kind: "account",
                path: "giveaway",
              },
            ],
          },
        },
        {
          name: "token_mint",
          writable: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "giveaway_id",
          type: "u64",
        },
        {
          name: "creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "repo_sol_giveaway",
      discriminator: [107, 231, 51, 253, 156, 175, 33, 38],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "destination_account",
          writable: true,
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 111, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "_giveaway_id",
              },
              {
                kind: "arg",
                path: "_creator_key",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "_giveaway_id",
          type: "u64",
        },
        {
          name: "_creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "repo_spl_giveaway",
      discriminator: [169, 134, 26, 249, 178, 157, 136, 123],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "destination_account",
          writable: true,
        },
        {
          name: "destination_token_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "destination_account",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "token_mint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "giveaway_id",
              },
              {
                kind: "arg",
                path: "creator_key",
              },
            ],
          },
        },
        {
          name: "giveaway_vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 116, 95,
                  118, 97, 117, 108, 116,
                ],
              },
              {
                kind: "account",
                path: "giveaway",
              },
            ],
          },
        },
        {
          name: "token_mint",
          writable: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
      ],
      args: [
        {
          name: "giveaway_id",
          type: "u64",
        },
        {
          name: "creator_key",
          type: "pubkey",
        },
      ],
    },
    {
      name: "set_sol_giveaway_winners",
      discriminator: [211, 54, 222, 98, 138, 97, 99, 186],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 111, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "options.giveaway_id",
              },
              {
                kind: "arg",
                path: "options.creator_key",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "options",
          type: {
            defined: {
              name: "SetSolGiveawayWinnersOptions",
            },
          },
        },
      ],
    },
    {
      name: "set_spl_giveaway_winners",
      discriminator: [126, 166, 249, 80, 171, 182, 72, 103],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "giveaway",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  115, 112, 108, 95, 103, 105, 118, 101, 97, 119, 97, 121,
                ],
              },
              {
                kind: "arg",
                path: "options.giveaway_id",
              },
              {
                kind: "arg",
                path: "options.creator_key",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "options",
          type: {
            defined: {
              name: "SetSplGiveawayWinnersOptions",
            },
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "SolGiveaway",
      discriminator: [211, 108, 91, 160, 22, 4, 186, 203],
    },
    {
      name: "SplGiveaway",
      discriminator: [146, 62, 250, 198, 146, 57, 131, 208],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Error",
    },
    {
      code: 6001,
      name: "NotAWinner",
      msg: "You are not a chosen winner",
    },
    {
      code: 6002,
      name: "NoPrizesLeft",
      msg: "There are no more giveaways",
    },
  ],
  types: [
    {
      name: "CreateSolGiveawayOptions",
      type: {
        kind: "struct",
        fields: [
          {
            name: "giveaway_id",
            type: "u64",
          },
          {
            name: "winners_amount",
            type: "u64",
          },
          {
            name: "lamports_amount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "CreateSplGiveawayOptions",
      type: {
        kind: "struct",
        fields: [
          {
            name: "giveaway_id",
            type: "u64",
          },
          {
            name: "winners_amount",
            type: "u64",
          },
          {
            name: "reward_amount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "SetSolGiveawayWinnersOptions",
      type: {
        kind: "struct",
        fields: [
          {
            name: "giveaway_id",
            type: "u64",
          },
          {
            name: "winner_keys",
            type: {
              vec: "pubkey",
            },
          },
          {
            name: "creator_key",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "SetSplGiveawayWinnersOptions",
      type: {
        kind: "struct",
        fields: [
          {
            name: "giveaway_id",
            type: "u64",
          },
          {
            name: "winner_keys",
            type: {
              vec: "pubkey",
            },
          },
          {
            name: "creator_key",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "SolGiveaway",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "winners_amount",
            type: "u64",
          },
          {
            name: "lamports_amount",
            type: "u64",
          },
          {
            name: "winners",
            type: {
              option: {
                vec: "pubkey",
              },
            },
          },
        ],
      },
    },
    {
      name: "SplGiveaway",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "token_address",
            type: "pubkey",
          },
          {
            name: "winners_amount",
            type: "u64",
          },
          {
            name: "reward_amount",
            type: "u64",
          },
          {
            name: "winners",
            type: {
              option: {
                vec: "pubkey",
              },
            },
          },
        ],
      },
    },
  ],
};