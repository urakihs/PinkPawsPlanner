// ============================================================================
//  characters.js — Character roster (CHARACTER_DB). Add new characters here.
// ----------------------------------------------------------------------------
//  GROUND RULE: every material a character references must already exist in
//  materials.js (and be named in items.js). If the game adds a NEW material,
//  add it to materials.js / items.js FIRST, then reference it here by the exact
//  string materials.js uses. A typo'd material name silently breaks costing.
//
//  HOW TO ADD A CHARACTER  (append one object to CHARACTER_DB)
//
//  Top-level fields:
//   • id — REQUIRED, unique, STABLE FOREVER. snake_case slug. Save key for the
//          player's roster, so never rename after shipping.
//   • name — REQUIRED display name. Keep the file PLAIN ASCII; escape non-ASCII
//          as \uXXXX.
//   • rank — 'S' | 'A'.
//   • element — one of: 'Cosmos' | 'Anima' | 'Chaos' | 'Psyche' |
//          'Incantation' | 'Lakshana'.
//   • weapon — the character's weapon TYPE: 'Solid' | 'Liquid' | 'Gas' |
//          'Plasma' | 'Condensate'.
//   • boss_mat — display name of the ascension boss material (must match a boss
//          material defined in materials.js).
//   • weekly_boss_mat — display name of the weekly-boss material (must match
//          materials.js), e.g. 'Good Boy Stamp', 'Dress Sleeves of Vanity',
//          'Eternal Memory'.
//   • common_mob — the common-mob family KEY string, matching a family in
//          materials.js COMMON_MOB_FAMILIES: 'Whispers' | 'Silhouettes' |
//          'Delusions' | 'Numerals'.
//   • esper_mat — the esper-material FAMILY name, matching materials.js
//          ESPER_MAT_FAMILIES: e.g. 'Nestling' | 'FNG' | 'Waves' | 'Thought' |
//          'Expectations'.
//   • specialty — Module type the character gains bonus value from:
//          'II' | 'III' (or null if unknown).
//
//  Console/optimizer fields (feed app/console-optimizer.html; merged in from the
//  former character-combat.js, consolidated here so there's one file to update
//  instead of two -- the two had already drifted out of sync once, see git
//  history):
//   • gridType — which of the 4 console board layouts (BOARDS 1-4 in
//          console-optimizer.html) the character uses.
//   • bonusStat — display name of the stat granted per specialty module
//          slotted (e.g. 'ATK%', 'Crit Rate', 'Cosmos DMG Bonus'), for
//          whichever module type `specialty` names. null if unknown.
//   • bonusPerModule — amount of bonusStat granted per specialty module
//          (percentage points for %-stats, flat points otherwise). null if
//          unknown.
//          All 20 characters' bonusStat/bonusPerModule are now datamine-
//          confirmed (DT_CharacterEquipmentSlotsData.json + DT_EquipmentModify
//          SlotsEffect.json) -- see "Console specialty bonus" in
//          docs/NTE_DATA_EXTRACTION.md for the exact source, field mapping,
//          and how to re-fetch for a new character.
//   • damageDim — which DIM key (see DIM in the optimizer engine) bonusStat
//          feeds into for damage scoring, or null if it doesn't contribute
//          to damage (e.g. DEF/HP bonuses) or is unknown.
//   • baseAtk — the character's own base ATK at max level/ascension (before
//          any arc/gear), used in the optimizer's BaseATK term. null while
//          unconfirmed; the optimizer falls back to CHAR_BASE_ATK_PLACEHOLDER.
//
//   • equipped_arc — a weapon id from weapons.js, or null if none equipped.
//   • specialEffects — OPTIONAL array of conditional/stacking combat buffs this
//          character's own kit grants (a passive that needs a toggle or a
//          stack/tier count to model, as opposed to a flat always-on number --
//          those just live directly on the character's other combat fields
//          above). Omit entirely if the character has none. This used to live
//          in a separate data/special-effects.js (SPECIAL_EFFECTS_DB, one
//          array shared by characters/arcs/cartridges via a source:{type,id}
//          tag) -- folded in here (and the equivalent field on weapons.js/
//          consoles.js) for locality: editing/browsing a character's effects
//          alongside their other data in one place beat keeping a same-shaped
//          entry findable only by matching a separate file's source id.
//          Each entry: {id, label, cond, stackMode?, maxStacks, perStack,
//          scope, alwaysOn, element?} — see console-optimizer.html's
//          specialEffectOffsets()/specialEffectApplies() for the full field
//          reference (still documented there, not duplicated here, since
//          arcs/cartridges use the exact same shape).
//
//  talents: { active_combat[], life[], passive[] }   (each item: {key,name,max_level})
//   • active_combat — exactly the four skills, each max_level 10:
//          basic_attack, skill, ultimate, support_skill.
//   • life — life_skill_1 (max_level 5; uses the SHARED LIFE_SKILL_1_COSTS table
//          in costs.js). OPTIONALLY a life_skill_2 entry whose cost curve is
//          PER-CHARACTER: it carries its own `costs` object keyed by FROM level
//          (0 = cost 0->1, 1 = cost 1->2, …), each value { ds, fn }
//          (ds = Dreamless Seeds, fn = Fons). max_level varies per character.
//          Omit the life_skill_2 entry entirely if the character has none.
//   • passive — passive_1 and passive_2, each max_level 1 (talents start at 0).
//
//  This file has NO module.exports (loaded via <script>). Leave it that way.
//  After editing: run `node --check app/data/characters.js`.
// ============================================================================
const CHARACTER_DB = [
  {
    id: "hotori",
    name: "Hotori",
    rank: "S",
    element: "Cosmos",
    weapon: "Solid",
    boss_mat: "Confessional Flower Seed",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Whispers",
    esper_mat: "Nestling",
    specialty: "III",
    gridType: 1,
    bonusStat: "Cosmos DMG Bonus",
    bonusPerModule: 10,
    damageDim: "dmgPct",
    baseAtk: 652,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "mint",
    name: "Mint",
    rank: "A",
    element: "Anima",
    weapon: "Liquid",
    boss_mat: "A Page from Delusion's Shore",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Silhouettes",
    esper_mat: "FNG",
    specialty: "III",
    gridType: 3,
    bonusStat: "Crit Rate",
    bonusPerModule: 7.5,
    damageDim: "critRate",
    baseAtk: 596,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "edgar",
    name: "Edgar",
    rank: "A",
    element: "Cosmos",
    weapon: "Liquid",
    boss_mat: "Colorful Ticket Stub",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Whispers",
    esper_mat: "Nestling",
    specialty: "III",
    gridType: 2,
    bonusStat: "HP",
    bonusPerModule: 10,
    damageDim: null,
    baseAtk: 421,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "zero",
    name: "Zero",
    rank: "S",
    element: "Cosmos",
    weapon: "Solid",
    boss_mat: "Charging Knight Spark Plug",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Whispers",
    esper_mat: "Nestling",
    specialty: "III",
    gridType: 4,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 676,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "jiuyuan",
    name: "Jiuyuan",
    rank: "S",
    element: "Anima",
    weapon: "Solid",
    boss_mat: "Tear of the Sea",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Silhouettes",
    esper_mat: "FNG",
    specialty: "II",
    gridType: 2,
    bonusStat: "Crit Rate",
    bonusPerModule: 6,
    damageDim: "critRate",
    baseAtk: 652,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "lacrimosa",
    name: "Lacrimosa",
    rank: "S",
    element: "Chaos",
    weapon: "Liquid",
    boss_mat: "Confessional Flower Seed",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Whispers",
    esper_mat: "Waves",
    specialty: "III",
    gridType: 2,
    bonusStat: "Chaos DMG Bonus",
    bonusPerModule: 10,
    damageDim: "dmgPct",
    baseAtk: 636,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        },
        {
          key: "life_skill_2",
          name: "Life Skill 2",
          max_level: 2,
          costs: {
            "0": {
              ds: 16,
              fn: 6400
            },
            "1": {
              ds: 24,
              fn: 10000
            }
          }
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "fadia",
    name: "Fadia",
    rank: "S",
    element: "Psyche",
    weapon: "Condensate",
    boss_mat: "Water Moon Pick",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Silhouettes",
    esper_mat: "Thought",
    specialty: "II",
    gridType: 4,
    bonusStat: "HP",
    bonusPerModule: 6,
    damageDim: null,
    baseAtk: 596,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "sakiri",
    name: "Sakiri",
    rank: "S",
    element: "Incantation",
    weapon: "Gas",
    boss_mat: "Charging Knight Spark Plug",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Numerals",
    esper_mat: "Expectations",
    specialty: "III",
    gridType: 1,
    bonusStat: "Incantation DMG Bonus",
    bonusPerModule: 9,
    damageDim: "dmgPct",
    baseAtk: 620,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "daffodill",
    name: "Daffodill",
    rank: "S",
    element: "Chaos",
    weapon: "Liquid",
    boss_mat: "Charging Knight Spark Plug",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Delusions",
    esper_mat: "Waves",
    specialty: "III",
    gridType: 4,
    bonusStat: "Chaos DMG Bonus",
    bonusPerModule: 10,
    damageDim: "dmgPct",
    baseAtk: 644,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "haniel",
    name: "Haniel",
    rank: "A",
    element: "Psyche",
    weapon: "Solid",
    boss_mat: "Nest Guard Fragment",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Numerals",
    esper_mat: "Waves",
    specialty: "III",
    gridType: 1,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 493,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "hathor",
    name: "Hathor",
    rank: "S",
    element: "Lakshana",
    weapon: "Plasma",
    boss_mat: "Colorful Ticket Stub",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Delusions",
    esper_mat: "Thought",
    specialty: "III",
    gridType: 4,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 644,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "baicang",
    name: "Baicang",
    rank: "S",
    element: "Incantation",
    weapon: "Condensate",
    boss_mat: "Nest Guard Fragment",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Delusions",
    esper_mat: "Expectations",
    specialty: "III",
    gridType: 3,
    bonusStat: "Crit Rate",
    bonusPerModule: 7.5,
    damageDim: "critRate",
    baseAtk: 644,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "aurelia",
    name: "Aurelia",
    rank: "A",
    element: "Psyche",
    weapon: "Plasma",
    boss_mat: "Nest Guard Fragment",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Delusions",
    esper_mat: "FNG",
    specialty: "III",
    gridType: 4,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 604,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "skia",
    name: "Skia",
    rank: "A",
    element: "Lakshana",
    weapon: "Gas",
    boss_mat: "Confessional Flower Seed",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Delusions",
    esper_mat: "Thought",
    specialty: "III",
    gridType: 3,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 557,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "nanally",
    name: "Nanally",
    rank: "S",
    element: "Anima",
    weapon: "Plasma",
    boss_mat: "A Page from Delusion's Shore",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Silhouettes",
    esper_mat: "FNG",
    specialty: "II",
    gridType: 2,
    bonusStat: "Crit Rate",
    bonusPerModule: 6,
    damageDim: "critRate",
    baseAtk: 636,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "adler",
    name: "Adler",
    rank: "A",
    element: "Incantation",
    weapon: "Condensate",
    boss_mat: "Water Moon Pick",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Delusions",
    esper_mat: "Expectations",
    specialty: "III",
    gridType: 1,
    bonusStat: "DEF",
    bonusPerModule: 12,
    damageDim: null,
    baseAtk: 437,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "chiz",
    name: "Chiz",
    rank: "S",
    element: "Cosmos",
    weapon: "Gas",
    boss_mat: "Tear of the Sea",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Whispers",
    esper_mat: "Nestling",
    specialty: "III",
    gridType: 3,
    bonusStat: "Cosmos DMG Bonus",
    bonusPerModule: 10,
    damageDim: "dmgPct",
    baseAtk: 660,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        },
        {
          key: "life_skill_2",
          name: "Life Skill 2",
          max_level: 1,
          costs: {
            "0": {
              ds: 24,
              fn: 10000
            }
          }
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "chaos",
    name: "Chaos",
    rank: "S",
    element: "Lakshana",
    weapon: "Condensate",
    boss_mat: "Tear of the Sea",
    weekly_boss_mat: "Eternal Memory",
    common_mob: "Delusions",
    esper_mat: "Thought",
    specialty: "III",
    gridType: 3,
    bonusStat: "Crit Dmg",
    bonusPerModule: 16,
    damageDim: "critDmg",
    baseAtk: 636,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        },
        {
          key: "life_skill_2",
          name: "Life Skill 2",
          max_level: 1,
          costs: {
            "0": {
              ds: 24,
              fn: 10000
            }
          }
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "iroi",
    name: "Iroi",
    rank: "S",
    element: "Anima",
    weapon: "Liquid",
    boss_mat: "A Page from Delusion's Shore",
    weekly_boss_mat: "Good Boy Stamp",
    common_mob: "Silhouettes",
    esper_mat: "FNG",
    specialty: "III",
    gridType: 1,
    bonusStat: "ATK%",
    bonusPerModule: 10,
    damageDim: "atkPct",
    baseAtk: 596,
    equipped_arc: null,
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        },
        {
          key: "life_skill_2",
          name: "Life Skill 2",
          max_level: 2,
          costs: {
            "0": {
              ds: 16,
              fn: 6400
            },
            "1": {
              ds: 24,
              fn: 10000
            }
          }
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  },
  {
    id: "shinku",
    name: "Shinku",
    rank: "S",
    element: "Cosmos",
    weapon: "Condensate",
    boss_mat: "Charging Knight Spark Plug",
    weekly_boss_mat: "Dress Sleeves of Vanity",
    common_mob: "Whispers",
    esper_mat: "Nestling",
    specialty: "III",
    gridType: 2,
    bonusStat: "Crit Dmg",
    bonusPerModule: 16,
    damageDim: "critDmg",
    baseAtk: 636,
    equipped_arc: null,
    specialEffects: [
      {
        id: "shinku-charge-enhancement",
        label: "Charge Enhancement",
        cond: "Off-field ally gains Ultimate Energy while Shinku is active + Charging",
        maxStacks: 10,
        perStack: [
          {
            stat: "atkPct",
            amount: 0.05
          }
        ],
        scope: {
          kind: "universal"
        },
        alwaysOn: false
      }
    ],
    talents: {
      active_combat: [
        {
          key: "basic_attack",
          name: "Basic Attack",
          max_level: 10
        },
        {
          key: "skill",
          name: "Skill",
          max_level: 10
        },
        {
          key: "ultimate",
          name: "Ultimate",
          max_level: 10
        },
        {
          key: "support_skill",
          name: "Support Skill",
          max_level: 10
        }
      ],
      life: [
        {
          key: "life_skill_1",
          name: "Life Skill 1",
          max_level: 5
        },
        {
          key: "life_skill_2",
          name: "Life Skill 2",
          max_level: 2,
          costs: {
            "0": {
              ds: 16,
              fn: 6400
            },
            "1": {
              ds: 24,
              fn: 10000
            }
          }
        }
      ],
      passive: [
        {
          key: "passive_1",
          name: "Passive 1",
          max_level: 1
        },
        {
          key: "passive_2",
          name: "Passive 2",
          max_level: 1
        }
      ]
    }
  }
];
