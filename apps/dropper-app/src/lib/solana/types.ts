/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/dropper_giveaway.json`.
 */
export type DropperGiveaway = {
  address: "DMvcnVsLb2KNE443utsyWSXv7MJYSrRDvCccgQNv28Pc";
  metadata: {
    name: "dropperGiveaway";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimSolGiveaway";
      discriminator: [93, 127, 226, 42, 125, 116, 15, 14];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  111,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "claimSplGiveaway";
      discriminator: [108, 91, 213, 43, 222, 80, 140, 197];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "winnerTokenAccout";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "giveawayVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                ];
              },
              {
                kind: "account";
                path: "giveaway";
              },
            ];
          };
        },
        {
          name: "tokenMint";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "createSolGiveaway";
      discriminator: [100, 209, 153, 18, 18, 220, 177, 38];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "dropperVault";
          writable: true;
          address: "A2RAA1j1RvQ5VDVzpmGY7S5JYc2abTXyLBUdze7DJKeM";
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  111,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "options.giveaway_id";
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "options";
          type: {
            defined: {
              name: "createSolGiveawayOptions";
            };
          };
        },
      ];
    },
    {
      name: "createSplGiveaway";
      discriminator: [45, 21, 230, 183, 194, 231, 168, 187];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "dropperVault";
          writable: true;
          address: "A2RAA1j1RvQ5VDVzpmGY7S5JYc2abTXyLBUdze7DJKeM";
        },
        {
          name: "tokenPayerAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "options.giveaway_id";
              },
              {
                kind: "account";
                path: "signer";
              },
            ];
          };
        },
        {
          name: "giveawayVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                ];
              },
              {
                kind: "account";
                path: "giveaway";
              },
            ];
          };
        },
        {
          name: "tokenMint";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
      ];
      args: [
        {
          name: "options";
          type: {
            defined: {
              name: "createSplGiveawayOptions";
            };
          };
        },
      ];
    },
    {
      name: "payoutSolGiveaway";
      discriminator: [161, 210, 228, 214, 80, 72, 166, 198];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "winnerAccount";
          writable: true;
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  111,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "payoutSplGiveaway";
      discriminator: [196, 35, 147, 172, 80, 106, 25, 130];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "winnerAccount";
          writable: true;
        },
        {
          name: "winnerTokenAccout";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "winnerAccount";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "giveawayVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                ];
              },
              {
                kind: "account";
                path: "giveaway";
              },
            ];
          };
        },
        {
          name: "tokenMint";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "repoSolGiveaway";
      discriminator: [107, 231, 51, 253, 156, 175, 33, 38];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "destinationAccount";
          writable: true;
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  111,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "repoSplGiveaway";
      discriminator: [169, 134, 26, 249, 178, 157, 136, 123];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "destinationAccount";
          writable: true;
        },
        {
          name: "destinationTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "destinationAccount";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "giveawayId";
              },
              {
                kind: "arg";
                path: "creatorKey";
              },
            ];
          };
        },
        {
          name: "giveawayVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  116,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                ];
              },
              {
                kind: "account";
                path: "giveaway";
              },
            ];
          };
        },
        {
          name: "tokenMint";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
      ];
      args: [
        {
          name: "giveawayId";
          type: "u64";
        },
        {
          name: "creatorKey";
          type: "pubkey";
        },
      ];
    },
    {
      name: "setSolGiveawayWinners";
      discriminator: [211, 54, 222, 98, 138, 97, 99, 186];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  111,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "options.giveaway_id";
              },
              {
                kind: "arg";
                path: "options.creator_key";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "options";
          type: {
            defined: {
              name: "setSolGiveawayWinnersOptions";
            };
          };
        },
      ];
    },
    {
      name: "setSplGiveawayWinners";
      discriminator: [126, 166, 249, 80, 171, 182, 72, 103];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "giveaway";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  115,
                  112,
                  108,
                  95,
                  103,
                  105,
                  118,
                  101,
                  97,
                  119,
                  97,
                  121,
                ];
              },
              {
                kind: "arg";
                path: "options.giveaway_id";
              },
              {
                kind: "arg";
                path: "options.creator_key";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "options";
          type: {
            defined: {
              name: "setSplGiveawayWinnersOptions";
            };
          };
        },
      ];
    },
  ];
  accounts: [
    {
      name: "solGiveaway";
      discriminator: [211, 108, 91, 160, 22, 4, 186, 203];
    },
    {
      name: "splGiveaway";
      discriminator: [146, 62, 250, 198, 146, 57, 131, 208];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "error";
    },
    {
      code: 6001;
      name: "notAWinner";
      msg: "You are not a chosen winner";
    },
    {
      code: 6002;
      name: "noPrizesLeft";
      msg: "There are no more giveaways";
    },
  ];
  types: [
    {
      name: "createSolGiveawayOptions";
      type: {
        kind: "struct";
        fields: [
          {
            name: "giveawayId";
            type: "u64";
          },
          {
            name: "winnersAmount";
            type: "u64";
          },
          {
            name: "lamportsAmount";
            type: "u64";
          },
        ];
      };
    },
    {
      name: "createSplGiveawayOptions";
      type: {
        kind: "struct";
        fields: [
          {
            name: "giveawayId";
            type: "u64";
          },
          {
            name: "winnersAmount";
            type: "u64";
          },
          {
            name: "rewardAmount";
            type: "u64";
          },
        ];
      };
    },
    {
      name: "setSolGiveawayWinnersOptions";
      type: {
        kind: "struct";
        fields: [
          {
            name: "giveawayId";
            type: "u64";
          },
          {
            name: "winnerKeys";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "creatorKey";
            type: "pubkey";
          },
        ];
      };
    },
    {
      name: "setSplGiveawayWinnersOptions";
      type: {
        kind: "struct";
        fields: [
          {
            name: "giveawayId";
            type: "u64";
          },
          {
            name: "winnerKeys";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "creatorKey";
            type: "pubkey";
          },
        ];
      };
    },
    {
      name: "solGiveaway";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "winnersAmount";
            type: "u64";
          },
          {
            name: "lamportsAmount";
            type: "u64";
          },
          {
            name: "winners";
            type: {
              option: {
                vec: "pubkey";
              };
            };
          },
        ];
      };
    },
    {
      name: "splGiveaway";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "tokenAddress";
            type: "pubkey";
          },
          {
            name: "winnersAmount";
            type: "u64";
          },
          {
            name: "rewardAmount";
            type: "u64";
          },
          {
            name: "winners";
            type: {
              option: {
                vec: "pubkey";
              };
            };
          },
        ];
      };
    },
  ];
};
