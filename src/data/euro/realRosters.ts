import type { RealPlayerDef } from '../realRosters';

// EUROLEAGUE & EUROCUP 2025-26 ROSTERS
// Stats source: Official EuroLeague 2025-26 season data
// Attributes computed via statConverter.ts algorithm

export const EURO_ROSTERS: Record<string, any[]> = {

    // ─── OLYMPIACOS (OLY) ───────────────────────────────────────────────────
    'OLY': [
        { firstName: 'Sasha', lastName: 'Vezenkov', position: 'PF', age: 30, height: 206, weight: 102, stars: 5.0, potential: 96, contract: { amount: 3700000, years: 4 },
          attributes: {
            finishing: 92, midRange: 88, threePointShot: 90, freeThrow: 89,
            playmaking: 62, ballHandling: 85, basketballIQ: 96, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 78, stealing: 68, blocking: 45,
            offensiveRebound: 84, defensiveRebound: 88
          },
          tendencies: { shooting: 95, passing: 45, inside: 65, outside: 92, defensiveAggression: 60, foulTendency: 35 } },
        { firstName: 'Tyler', lastName: 'Dorsey', position: 'SG', age: 30, height: 196, weight: 83, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 86, threePointShot: 89, freeThrow: 79,
            playmaking: 75, ballHandling: 80, basketballIQ: 85, athleticism: 84,
            interiorDefense: 62, perimeterDefense: 74, stealing: 72, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 92, passing: 65, inside: 55, outside: 94, defensiveAggression: 55, foulTendency: 45 } },
        { firstName: 'Evan', lastName: 'Fournier', position: 'SF', age: 33, height: 198, weight: 93, stars: 4.5, potential: 86, contract: { amount: 2000000, years: 2 },
          attributes: {
            finishing: 80, midRange: 84, threePointShot: 87, freeThrow: 80,
            playmaking: 78, ballHandling: 78, basketballIQ: 90, athleticism: 76,
            interiorDefense: 60, perimeterDefense: 70, stealing: 75, blocking: 30,
            offensiveRebound: 50, defensiveRebound: 62
          },
          tendencies: { shooting: 94, passing: 72, inside: 50, outside: 92, defensiveAggression: 50, foulTendency: 40 } },
        { firstName: 'Nikola', lastName: 'Milutinov', position: 'C', age: 31, height: 213, weight: 116, stars: 5.0, potential: 94, contract: { amount: 2000000, years: 1 },
          attributes: {
            finishing: 96, midRange: 65, threePointShot: 25, freeThrow: 78,
            playmaking: 68, ballHandling: 65, basketballIQ: 92, athleticism: 72,
            interiorDefense: 88, perimeterDefense: 55, stealing: 60, blocking: 82,
            offensiveRebound: 99, defensiveRebound: 92
          },
          tendencies: { shooting: 75, passing: 55, inside: 96, outside: 25, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Thomas', lastName: 'Walkup', position: 'PG', age: 32, height: 193, weight: 92, stars: 4.5, potential: 88,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 75,
            playmaking: 96, ballHandling: 72, basketballIQ: 98, athleticism: 82,
            interiorDefense: 70, perimeterDefense: 98, stealing: 94, blocking: 35,
            offensiveRebound: 58, defensiveRebound: 72
          },
          tendencies: { shooting: 55, passing: 98, inside: 45, outside: 75, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Moustapha', lastName: 'Fall', position: 'C', age: 33, height: 218, weight: 125, stars: 4.5, potential: 85,
          attributes: {
            finishing: 92, midRange: 45, threePointShot: 25, freeThrow: 40,
            playmaking: 85, ballHandling: 60, basketballIQ: 95, athleticism: 65,
            interiorDefense: 96, perimeterDefense: 45, stealing: 40, blocking: 99,
            offensiveRebound: 92, defensiveRebound: 88
          },
          tendencies: { shooting: 45, passing: 92, inside: 98, outside: 25, defensiveAggression: 85, foulTendency: 70 } },
        { firstName: 'Alec', lastName: 'Peters', position: 'PF', age: 31, height: 206, weight: 107, stars: 4.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 88, threePointShot: 92, freeThrow: 84,
            playmaking: 65, ballHandling: 72, basketballIQ: 88, athleticism: 70,
            interiorDefense: 68, perimeterDefense: 65, stealing: 60, blocking: 35,
            offensiveRebound: 72, defensiveRebound: 82
          },
          tendencies: { shooting: 82, passing: 55, inside: 45, outside: 94, defensiveAggression: 45, foulTendency: 40 } },
        { firstName: 'Donta', lastName: 'Hall', position: 'C', age: 28, height: 208, weight: 105, stars: 4.0, potential: 84,
          attributes: {
            finishing: 94, midRange: 40, threePointShot: 25, freeThrow: 77,
            playmaking: 55, ballHandling: 70, basketballIQ: 80, athleticism: 96,
            interiorDefense: 85, perimeterDefense: 58, stealing: 72, blocking: 94,
            offensiveRebound: 94, defensiveRebound: 90
          },
          tendencies: { shooting: 65, passing: 45, inside: 98, outside: 25, defensiveAggression: 90, foulTendency: 65 } },
        { firstName: 'Tyrique', lastName: 'Jones', position: 'C', age: 28, height: 206, weight: 108, stars: 4.0, potential: 83,
          attributes: {
            finishing: 92, midRange: 45, threePointShot: 25, freeThrow: 68,
            playmaking: 65, ballHandling: 68, basketballIQ: 82, athleticism: 94,
            interiorDefense: 82, perimeterDefense: 62, stealing: 88, blocking: 88,
            offensiveRebound: 92, defensiveRebound: 85
          },
          tendencies: { shooting: 70, passing: 50, inside: 96, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Shaquielle', lastName: 'McKissic', position: 'SF', age: 35, height: 196, weight: 91, stars: 3.5, potential: 78,
          attributes: {
            finishing: 88, midRange: 72, threePointShot: 70, freeThrow: 64,
            playmaking: 75, ballHandling: 82, basketballIQ: 80, athleticism: 95,
            interiorDefense: 65, perimeterDefense: 78, stealing: 85, blocking: 35,
            offensiveRebound: 62, defensiveRebound: 68
          },
          tendencies: { shooting: 82, passing: 70, inside: 90, outside: 65, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Kostas', lastName: 'Papanikolaou', position: 'SF', age: 35, height: 204, weight: 104, stars: 3.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 78, freeThrow: 28,
            playmaking: 72, ballHandling: 65, basketballIQ: 95, athleticism: 70,
            interiorDefense: 78, perimeterDefense: 85, stealing: 78, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 78
          },
          tendencies: { shooting: 65, passing: 75, inside: 60, outside: 80, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Frank', lastName: 'Ntilikina', position: 'PG', age: 27, height: 193, weight: 91, stars: 3.0, potential: 78,
          attributes: {
            finishing: 70, midRange: 75, threePointShot: 78, freeThrow: 84,
            playmaking: 70, ballHandling: 72, basketballIQ: 82, athleticism: 85,
            interiorDefense: 68, perimeterDefense: 90, stealing: 82, blocking: 55,
            offensiveRebound: 60, defensiveRebound: 62
          },
          tendencies: { shooting: 60, passing: 75, inside: 45, outside: 80, defensiveAggression: 90, foulTendency: 60 } },
        { firstName: 'Cory', lastName: 'Joseph', position: 'PG', age: 34, height: 191, weight: 91, stars: 3.0, potential: 74,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 78, freeThrow: 80,
            playmaking: 78, ballHandling: 78, basketballIQ: 92, athleticism: 75,
            interiorDefense: 62, perimeterDefense: 78, stealing: 74, blocking: 30,
            offensiveRebound: 60, defensiveRebound: 65
          },
          tendencies: { shooting: 68, passing: 82, inside: 50, outside: 78, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Tyson', lastName: 'Ward', position: 'SF', age: 27, height: 203, weight: 95, stars: 3.0, potential: 79,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 68, freeThrow: 68,
            playmaking: 75, ballHandling: 75, basketballIQ: 82, athleticism: 88,
            interiorDefense: 72, perimeterDefense: 78, stealing: 78, blocking: 45,
            offensiveRebound: 72, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 65, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Giannoulis', lastName: 'Larentzakis', position: 'SG', age: 32, height: 196, weight: 91, stars: 2.5, potential: 68,
          attributes: {
            finishing: 65, midRange: 72, threePointShot: 75, freeThrow: 75,
            playmaking: 85, ballHandling: 70, basketballIQ: 85, athleticism: 75,
            interiorDefense: 60, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 75, passing: 85, inside: 45, outside: 90, defensiveAggression: 90, foulTendency: 65 } },
        { firstName: 'Keenan', lastName: 'Evans', position: 'PG', age: 29, height: 191, weight: 86, stars: 4.5, potential: 92,
          attributes: {
            finishing: 88, midRange: 90, threePointShot: 92, freeThrow: 85,
            playmaking: 88, ballHandling: 90, basketballIQ: 92, athleticism: 88,
            interiorDefense: 65, perimeterDefense: 82, stealing: 85, blocking: 30,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 90, passing: 85, inside: 75, outside: 95, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Monte', lastName: 'Morris', position: 'PG', age: 30, height: 188, weight: 79, stars: 3.0, potential: 80,
          attributes: {
            finishing: 74, midRange: 82, threePointShot: 75, freeThrow: 80,
            playmaking: 75, ballHandling: 92, basketballIQ: 90, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 72, stealing: 65, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 62
          },
          tendencies: { shooting: 65, passing: 85, inside: 55, outside: 75, defensiveAggression: 60, foulTendency: 35 } },
        { firstName: 'Omer', lastName: 'Netzipoglou', position: 'SG', age: 23, height: 193, weight: 88, stars: 2.0, potential: 75,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 68, freeThrow: 65,
            playmaking: 60, ballHandling: 70, basketballIQ: 72, athleticism: 85,
            interiorDefense: 62, perimeterDefense: 75, stealing: 68, blocking: 30,
            offensiveRebound: 75, defensiveRebound: 65
          },
          tendencies: { shooting: 65, passing: 55, inside: 70, outside: 65, defensiveAggression: 75, foulTendency: 50 } }
    ],

    // ─── ANADOLU EFES (IST) ───────────────────────────────────────────────────
    'IST': [
        { firstName: 'Shane', lastName: 'Larkin', position: 'PG', age: 32, height: 182, weight: 79, stars: 5.0, potential: 92, contract: { amount: 3000000, years: 2 },
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 94, freeThrow: 89,
            playmaking: 92, ballHandling: 96, basketballIQ: 95, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 94, passing: 88, inside: 45, outside: 95, defensiveAggression: 65, foulTendency: 40 } },
        { firstName: 'Jordan', lastName: 'Loyd', position: 'SG', age: 31, height: 193, weight: 95, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 86, threePointShot: 84, freeThrow: 86,
            playmaking: 75, ballHandling: 85, basketballIQ: 88, athleticism: 84,
            interiorDefense: 55, perimeterDefense: 78, stealing: 75, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 62
          },
          tendencies: { shooting: 88, passing: 65, inside: 60, outside: 88, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Saben', lastName: 'Lee', position: 'PG', age: 25, height: 188, weight: 83, stars: 4.0, potential: 88,
          attributes: {
            finishing: 90, midRange: 75, threePointShot: 72, freeThrow: 75,
            playmaking: 88, ballHandling: 92, basketballIQ: 82, athleticism: 95,
            interiorDefense: 40, perimeterDefense: 74, stealing: 82, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 55
          },
          tendencies: { shooting: 92, passing: 82, inside: 85, outside: 65, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Erxhan', lastName: 'Osmani', position: 'PF', age: 26, height: 213, weight: 102, stars: 4.0, potential: 85,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 88, freeThrow: 78,
            playmaking: 65, ballHandling: 70, basketballIQ: 84, athleticism: 78,
            interiorDefense: 78, perimeterDefense: 68, stealing: 65, blocking: 65,
            offensiveRebound: 75, defensiveRebound: 85
          },
          tendencies: { shooting: 80, passing: 55, inside: 60, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'P.J.', lastName: 'Dozier', position: 'SF', age: 28, height: 198, weight: 93, stars: 3.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 82, freeThrow: 71,
            playmaking: 78, ballHandling: 85, basketballIQ: 85, athleticism: 88,
            interiorDefense: 65, perimeterDefense: 88, stealing: 85, blocking: 55,
            offensiveRebound: 55, defensiveRebound: 68
          },
          tendencies: { shooting: 85, passing: 78, inside: 65, outside: 78, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Isaia', lastName: 'Cordinier', position: 'SF', age: 28, height: 196, weight: 84, stars: 4.0, potential: 86,
          attributes: {
            finishing: 88, midRange: 75, threePointShot: 75, freeThrow: 84,
            playmaking: 75, ballHandling: 78, basketballIQ: 84, athleticism: 94,
            interiorDefense: 65, perimeterDefense: 85, stealing: 82, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 72
          },
          tendencies: { shooting: 80, passing: 72, inside: 85, outside: 65, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Vincent', lastName: 'Poirier', position: 'C', age: 31, height: 213, weight: 110, stars: 4.5, potential: 87,
          attributes: {
            finishing: 92, midRange: 60, threePointShot: 25, freeThrow: 75,
            playmaking: 68, ballHandling: 62, basketballIQ: 88, athleticism: 85,
            interiorDefense: 90, perimeterDefense: 55, stealing: 65, blocking: 88,
            offensiveRebound: 92, defensiveRebound: 90
          },
          tendencies: { shooting: 75, passing: 60, inside: 95, outside: 25, defensiveAggression: 85, foulTendency: 70 } },
        { firstName: 'Nick', lastName: 'Weiler-Babb', position: 'PG', age: 29, height: 196, weight: 91, stars: 4.0, potential: 84,
          attributes: {
            finishing: 72, midRange: 78, threePointShot: 85, freeThrow: 75,
            playmaking: 88, ballHandling: 82, basketballIQ: 96, athleticism: 82,
            interiorDefense: 65, perimeterDefense: 95, stealing: 85, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 75
          },
          tendencies: { shooting: 65, passing: 92, inside: 45, outside: 82, defensiveAggression: 92, foulTendency: 50 } },
        { firstName: 'Rolands', lastName: 'Smits', position: 'PF', age: 29, height: 208, weight: 107, stars: 3.5, potential: 82,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 80, freeThrow: 73,
            playmaking: 60, ballHandling: 68, basketballIQ: 85, athleticism: 78,
            interiorDefense: 80, perimeterDefense: 65, stealing: 60, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 55, inside: 75, outside: 75, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Sehmus', lastName: 'Hazer', position: 'SG', age: 26, height: 191, weight: 88, stars: 2.5, potential: 78,
          attributes: {
            finishing: 80, midRange: 72, threePointShot: 75, freeThrow: 75,
            playmaking: 72, ballHandling: 82, basketballIQ: 78, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 50
          },
          tendencies: { shooting: 82, passing: 68, inside: 75, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Cole', lastName: 'Swider', position: 'SF', age: 25, height: 206, weight: 100, stars: 3.5, potential: 84,
          attributes: {
            finishing: 72, midRange: 88, threePointShot: 98, freeThrow: 95,
            playmaking: 60, ballHandling: 72, basketballIQ: 88, athleticism: 75,
            interiorDefense: 60, perimeterDefense: 62, stealing: 60, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 72
          },
          tendencies: { shooting: 95, passing: 52, inside: 45, outside: 99, defensiveAggression: 50, foulTendency: 35 } },
        { firstName: 'Brice', lastName: 'Dessert', position: 'C', age: 21, height: 211, weight: 105, stars: 3.0, potential: 82,
          attributes: {
            finishing: 88, midRange: 45, threePointShot: 25, freeThrow: 53,
            playmaking: 55, ballHandling: 60, basketballIQ: 78, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 45, stealing: 65, blocking: 88,
            offensiveRebound: 88, defensiveRebound: 82
          },
          tendencies: { shooting: 65, passing: 45, inside: 95, outside: 25, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Rodrigue', lastName: 'Beaubois', position: 'SG', age: 36, height: 188, weight: 84, stars: 3.5, potential: 78,
          attributes: {
            finishing: 78, midRange: 85, threePointShot: 82, freeThrow: 99,
            playmaking: 75, ballHandling: 82, basketballIQ: 92, athleticism: 78,
            interiorDefense: 50, perimeterDefense: 74, stealing: 78, blocking: 45,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 85, passing: 75, inside: 55, outside: 85, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Kai', lastName: 'Jones', position: 'C', age: 24, height: 211, weight: 100, stars: 3.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 40, threePointShot: 25, freeThrow: 67,
            playmaking: 52, ballHandling: 72, basketballIQ: 78, athleticism: 98,
            interiorDefense: 88, perimeterDefense: 62, stealing: 72, blocking: 99,
            offensiveRebound: 82, defensiveRebound: 92
          },
          tendencies: { shooting: 55, passing: 45, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'David', lastName: 'Mutaf', position: 'SG', age: 22, height: 197, weight: 88, stars: 2.0, potential: 78,
          attributes: {
            finishing: 72, midRange: 82, threePointShot: 92, freeThrow: 50,
            playmaking: 68, ballHandling: 75, basketballIQ: 80, athleticism: 78,
            interiorDefense: 45, perimeterDefense: 65, stealing: 55, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 40
          },
          tendencies: { shooting: 88, passing: 65, inside: 45, outside: 95, defensiveAggression: 55, foulTendency: 40 } },
        { firstName: 'George', lastName: 'Papagiannis', position: 'C', age: 27, height: 220, weight: 125, stars: 3.5, potential: 80,
          attributes: {
            finishing: 85, midRange: 65, threePointShot: 65, freeThrow: 50,
            playmaking: 62, ballHandling: 55, basketballIQ: 85, athleticism: 65,
            interiorDefense: 88, perimeterDefense: 45, stealing: 60, blocking: 92,
            offensiveRebound: 85, defensiveRebound: 90
          },
          tendencies: { shooting: 60, passing: 55, inside: 82, outside: 55, defensiveAggression: 75, foulTendency: 60 } },
        { firstName: 'Erkan', lastName: 'Yilmaz', position: 'SF', age: 27, height: 192, weight: 91, stars: 2.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 55, freeThrow: 68,
            playmaking: 65, ballHandling: 68, basketballIQ: 80, athleticism: 85,
            interiorDefense: 62, perimeterDefense: 88, stealing: 95, blocking: 75,
            offensiveRebound: 72, defensiveRebound: 85
          },
          tendencies: { shooting: 55, passing: 65, inside: 75, outside: 45, defensiveAggression: 95, foulTendency: 65 } }
    ],

    // Empty rosters for remaining teams (to be filled team by team)
    // ─── PANATHINAIKOS (PAN) ────────────────────────────────────────────────
    'PAN': [
        { firstName: 'Kendrick', lastName: 'Nunn', position: 'SG', age: 29, height: 191, weight: 86, stars: 5.0, potential: 92, contract: { amount: 2500000, years: 2 },
          attributes: {
            finishing: 92, midRange: 92, threePointShot: 89, freeThrow: 89,
            playmaking: 82, ballHandling: 90, basketballIQ: 92, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 95, passing: 75, inside: 75, outside: 89, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Nigel', lastName: 'Hayes-Davis', position: 'PF', age: 30, height: 203, weight: 103, stars: 5.0, potential: 90,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 82, freeThrow: 86,
            playmaking: 72, ballHandling: 78, basketballIQ: 95, athleticism: 88,
            interiorDefense: 85, perimeterDefense: 85, stealing: 85, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 68
          },
          tendencies: { shooting: 85, passing: 72, inside: 75, outside: 82, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Cedi', lastName: 'Osman', position: 'SF', age: 29, height: 201, weight: 104, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 85, freeThrow: 83,
            playmaking: 68, ballHandling: 82, basketballIQ: 90, athleticism: 85,
            interiorDefense: 62, perimeterDefense: 82, stealing: 75, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 68, inside: 75, outside: 85, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Kostas', lastName: 'Sloukas', position: 'PG', age: 34, height: 190, weight: 87, stars: 4.5, potential: 86, contract: { amount: 2800000, years: 2 },
          attributes: {
            finishing: 78, midRange: 85, threePointShot: 88, freeThrow: 91,
            playmaking: 98, ballHandling: 92, basketballIQ: 99, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 99, inside: 55, outside: 88, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'T.J.', lastName: 'Shorts II', position: 'PG', age: 27, height: 175, weight: 73, stars: 4.0, potential: 90,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 75, freeThrow: 72,
            playmaking: 92, ballHandling: 96, basketballIQ: 94, athleticism: 94,
            interiorDefense: 35, perimeterDefense: 78, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 92, passing: 92, inside: 75, outside: 75, defensiveAggression: 82, foulTendency: 45 } },
        { firstName: 'Mathias', lastName: 'Lessort', position: 'C', age: 29, height: 206, weight: 112, stars: 4.5, potential: 88, contract: { amount: 1800000, years: 1 },
          attributes: {
            finishing: 92, midRange: 35, threePointShot: 25, freeThrow: 67,
            playmaking: 62, ballHandling: 65, basketballIQ: 92, athleticism: 92,
            interiorDefense: 88, perimeterDefense: 45, stealing: 78, blocking: 45,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 65, passing: 62, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Juancho', lastName: 'Hernangomez', position: 'PF', age: 29, height: 206, weight: 97, stars: 4.0, potential: 86, contract: { amount: 2200000, years: 1 },
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 86, freeThrow: 75,
            playmaking: 65, ballHandling: 72, basketballIQ: 92, athleticism: 85,
            interiorDefense: 75, perimeterDefense: 78, stealing: 72, blocking: 45,
            offensiveRebound: 78, defensiveRebound: 88
          },
          tendencies: { shooting: 78, passing: 65, inside: 65, outside: 86, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Richaun', lastName: 'Holmes', position: 'C', age: 31, height: 206, weight: 107, stars: 3.5, potential: 82,
          attributes: {
            finishing: 90, midRange: 45, threePointShot: 25, freeThrow: 68,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 90,
            interiorDefense: 85, perimeterDefense: 45, stealing: 65, blocking: 75,
            offensiveRebound: 78, defensiveRebound: 72
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Jerian', lastName: 'Grant', position: 'PG', age: 32, height: 196, weight: 90, stars: 3.5, potential: 80,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 84, freeThrow: 82,
            playmaking: 85, ballHandling: 88, basketballIQ: 92, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 92, stealing: 92, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 85, inside: 65, outside: 84, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Omer', lastName: 'Yurtseven', position: 'C', age: 26, height: 211, weight: 120, stars: 3.5, potential: 88,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 81,
            playmaking: 58, ballHandling: 62, basketballIQ: 85, athleticism: 78,
            interiorDefense: 92, perimeterDefense: 35, stealing: 72, blocking: 95,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 65, passing: 58, inside: 92, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Kenneth', lastName: 'Faried', position: 'PF', age: 35, height: 203, weight: 100, stars: 3.5, potential: 78,
          attributes: {
            finishing: 88, midRange: 25, threePointShot: 25, freeThrow: 66,
            playmaking: 52, ballHandling: 58, basketballIQ: 82, athleticism: 92,
            interiorDefense: 82, perimeterDefense: 45, stealing: 72, blocking: 95,
            offensiveRebound: 99, defensiveRebound: 88
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 95, foulTendency: 75 } },
        { firstName: 'Nikos', lastName: 'Rogkavopoulos', position: 'SF', age: 23, height: 203, weight: 91, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 83, freeThrow: 89,
            playmaking: 62, ballHandling: 78, basketballIQ: 88, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 83, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Alexandros', lastName: 'Samodurov', position: 'PF', age: 20, height: 210, weight: 95, stars: 3.0, potential: 95,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 75, freeThrow: 67,
            playmaking: 58, ballHandling: 72, basketballIQ: 85, athleticism: 88,
            interiorDefense: 85, perimeterDefense: 55, stealing: 72, blocking: 99,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 58, inside: 82, outside: 75, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Kostas', lastName: 'Mitoglou', position: 'PF', age: 28, height: 210, weight: 116, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 73, freeThrow: 81,
            playmaking: 62, ballHandling: 68, basketballIQ: 92, athleticism: 80,
            interiorDefense: 82, perimeterDefense: 65, stealing: 75, blocking: 65,
            offensiveRebound: 75, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 62, inside: 85, outside: 73, defensiveAggression: 85, foulTendency: 65 } }
    ],
    // ─── REAL MADRID (MAD) ──────────────────────────────────────────────────
    'MAD': [
        { firstName: 'Trey', lastName: 'Lyles', position: 'PF', age: 29, height: 208, weight: 106, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 94, freeThrow: 79,
            playmaking: 75, ballHandling: 82, basketballIQ: 92, athleticism: 85,
            interiorDefense: 75, perimeterDefense: 72, stealing: 72, blocking: 75,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 92, passing: 72, inside: 75, outside: 94, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Mario', lastName: 'Hezonja', position: 'SF', age: 30, height: 203, weight: 110, stars: 5.0, potential: 90, contract: { amount: 2500000, years: 4 },
          attributes: {
            finishing: 92, midRange: 85, threePointShot: 85, freeThrow: 81,
            playmaking: 78, ballHandling: 88, basketballIQ: 90, athleticism: 92,
            interiorDefense: 65, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 65
          },
          tendencies: { shooting: 99, passing: 75, inside: 85, outside: 85, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Facundo', lastName: 'Campazzo', position: 'PG', age: 34, height: 178, weight: 88, stars: 5.0, potential: 88, contract: { amount: 2800000, years: 3 },
          attributes: {
            finishing: 78, midRange: 88, threePointShot: 93, freeThrow: 85,
            playmaking: 99, ballHandling: 96, basketballIQ: 99, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 95, stealing: 95, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 99, inside: 55, outside: 93, defensiveAggression: 99, foulTendency: 55 } },
        { firstName: 'Edy', lastName: 'Tavares', position: 'C', age: 33, height: 221, weight: 120, stars: 5.0, potential: 90, contract: { amount: 3000000, years: 4 },
          attributes: {
            finishing: 94, midRange: 25, threePointShot: 25, freeThrow: 73,
            playmaking: 52, ballHandling: 58, basketballIQ: 94, athleticism: 78,
            interiorDefense: 99, perimeterDefense: 35, stealing: 75, blocking: 99,
            offensiveRebound: 95, defensiveRebound: 92
          },
          tendencies: { shooting: 65, passing: 52, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Theo', lastName: 'Maledon', position: 'PG', age: 24, height: 193, weight: 80, stars: 4.5, potential: 92,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 81, freeThrow: 87,
            playmaking: 88, ballHandling: 88, basketballIQ: 88, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 88, inside: 75, outside: 81, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Gabriel', lastName: 'Deck', position: 'PF', age: 30, height: 198, weight: 105, stars: 4.0, potential: 84,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 86, freeThrow: 82,
            playmaking: 68, ballHandling: 78, basketballIQ: 94, athleticism: 82,
            interiorDefense: 85, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 72, passing: 68, inside: 85, outside: 86, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Andres', lastName: 'Feliz', position: 'PG', age: 27, height: 188, weight: 88, stars: 4.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 90, freeThrow: 74,
            playmaking: 82, ballHandling: 85, basketballIQ: 88, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 48
          },
          tendencies: { shooting: 82, passing: 82, inside: 65, outside: 90, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Chuma', lastName: 'Okeke', position: 'PF', age: 26, height: 201, weight: 104, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 89, freeThrow: 68,
            playmaking: 62, ballHandling: 72, basketballIQ: 90, athleticism: 88,
            interiorDefense: 82, perimeterDefense: 85, stealing: 85, blocking: 75,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 62, inside: 75, outside: 89, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Usman', lastName: 'Garuba', position: 'C', age: 23, height: 203, weight: 104, stars: 3.5, potential: 92,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 75, freeThrow: 66,
            playmaking: 55, ballHandling: 62, basketballIQ: 92, athleticism: 92,
            interiorDefense: 90, perimeterDefense: 92, stealing: 99, blocking: 95,
            offensiveRebound: 82, defensiveRebound: 75
          },
          tendencies: { shooting: 60, passing: 55, inside: 92, outside: 55, defensiveAggression: 99, foulTendency: 75 } },
        { firstName: 'Alberto', lastName: 'Abalde', position: 'SF', age: 29, height: 202, weight: 95, stars: 3.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 95, freeThrow: 80,
            playmaking: 72, ballHandling: 78, basketballIQ: 90, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 82, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 75, passing: 72, inside: 65, outside: 95, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Sergio', lastName: 'Llull', position: 'PG', age: 37, height: 190, weight: 94, stars: 3.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 75, freeThrow: 67,
            playmaking: 85, ballHandling: 85, basketballIQ: 99, athleticism: 75,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 85, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Alex', lastName: 'Len', position: 'C', age: 31, height: 213, weight: 113, stars: 3.0, potential: 80,
          attributes: {
            finishing: 82, midRange: 35, threePointShot: 25, freeThrow: 77,
            playmaking: 45, ballHandling: 52, basketballIQ: 82, athleticism: 75,
            interiorDefense: 88, perimeterDefense: 35, stealing: 62, blocking: 99,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 55, passing: 45, inside: 88, outside: 25, defensiveAggression: 85, foulTendency: 70 } },
        { firstName: 'Gabriele', lastName: 'Procida', position: 'SG', age: 22, height: 198, weight: 82, stars: 3.0, potential: 92,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 85, freeThrow: 100,
            playmaking: 62, ballHandling: 82, basketballIQ: 85, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 52
          },
          tendencies: { shooting: 82, passing: 62, inside: 75, outside: 85, defensiveAggression: 75, foulTendency: 50 } }
    ],
    // ─── FC BARCELONA (BAR) ─────────────────────────────────────────────────
    'BAR': [
        { firstName: 'Kevin', lastName: 'Punter', position: 'SG', age: 31, height: 193, weight: 86, stars: 5.0, potential: 92, contract: { amount: 2200000, years: 1 },
          attributes: {
            finishing: 85, midRange: 94, threePointShot: 92, freeThrow: 87,
            playmaking: 78, ballHandling: 90, basketballIQ: 92, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 95, passing: 65, inside: 60, outside: 95, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Will', lastName: 'Clyburn', position: 'SF', age: 34, height: 201, weight: 95, stars: 4.5, potential: 88, contract: { amount: 1800000, years: 2 },
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 88, freeThrow: 73,
            playmaking: 72, ballHandling: 85, basketballIQ: 90, athleticism: 84,
            interiorDefense: 65, perimeterDefense: 78, stealing: 82, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 92, passing: 65, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Tornike', lastName: 'Shengelia', position: 'PF', age: 33, height: 206, weight: 109, stars: 4.5, potential: 88, contract: { amount: 2000000, years: 1 },
          attributes: {
            finishing: 90, midRange: 82, threePointShot: 85, freeThrow: 82,
            playmaking: 82, ballHandling: 84, basketballIQ: 94, athleticism: 82,
            interiorDefense: 78, perimeterDefense: 65, stealing: 72, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 85, passing: 82, inside: 90, outside: 65, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Jan', lastName: 'Vesely', position: 'C', age: 34, height: 213, weight: 110, stars: 4.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 85, threePointShot: 35, freeThrow: 77,
            playmaking: 65, ballHandling: 68, basketballIQ: 95, athleticism: 88,
            interiorDefense: 88, perimeterDefense: 72, stealing: 88, blocking: 75,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 65, inside: 95, outside: 35, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Nicolas', lastName: 'Laprovittola', position: 'PG', age: 34, height: 193, weight: 82, stars: 4.5, potential: 88,
          attributes: {
            finishing: 78, midRange: 85, threePointShot: 85, freeThrow: 92,
            playmaking: 98, ballHandling: 92, basketballIQ: 96, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 98, inside: 45, outside: 92, defensiveAggression: 65, foulTendency: 55 } },
        { firstName: 'Tomas', lastName: 'Satoransky', position: 'PG', age: 33, height: 201, weight: 95, stars: 4.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 98, freeThrow: 73,
            playmaking: 88, ballHandling: 85, basketballIQ: 95, athleticism: 82,
            interiorDefense: 62, perimeterDefense: 88, stealing: 75, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 68
          },
          tendencies: { shooting: 75, passing: 88, inside: 60, outside: 98, defensiveAggression: 85, foulTendency: 45 } },
        { firstName: 'Dario', lastName: 'Brizuela', position: 'SG', age: 30, height: 188, weight: 75, stars: 3.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 85, freeThrow: 87,
            playmaking: 75, ballHandling: 88, basketballIQ: 85, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 68, stealing: 68, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 92, passing: 72, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 50 } },
        { firstName: 'Willy', lastName: 'Hernangomez', position: 'C', age: 30, height: 211, weight: 113, stars: 4.0, potential: 88, contract: { amount: 2200000, years: 2 },
          attributes: {
            finishing: 92, midRange: 60, threePointShot: 35, freeThrow: 66,
            playmaking: 55, ballHandling: 62, basketballIQ: 85, athleticism: 80,
            interiorDefense: 82, perimeterDefense: 45, stealing: 65, blocking: 82,
            offensiveRebound: 95, defensiveRebound: 92
          },
          tendencies: { shooting: 75, passing: 55, inside: 95, outside: 35, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Youssoupha', lastName: 'Fall', position: 'C', age: 30, height: 221, weight: 125, stars: 4.0, potential: 84,
          attributes: {
            finishing: 95, midRange: 25, threePointShot: 25, freeThrow: 62,
            playmaking: 45, ballHandling: 48, basketballIQ: 82, athleticism: 72,
            interiorDefense: 92, perimeterDefense: 35, stealing: 55, blocking: 88,
            offensiveRebound: 98, defensiveRebound: 95
          },
          tendencies: { shooting: 65, passing: 45, inside: 99, outside: 25, defensiveAggression: 85, foulTendency: 70 } },
        { firstName: 'Joel', lastName: 'Parra', position: 'SF', age: 24, height: 202, weight: 95, stars: 3.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 78, freeThrow: 79,
            playmaking: 65, ballHandling: 72, basketballIQ: 85, athleticism: 82,
            interiorDefense: 65, perimeterDefense: 78, stealing: 72, blocking: 35,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 68, inside: 65, outside: 78, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Miles', lastName: 'Norris', position: 'PF', age: 24, height: 208, weight: 95, stars: 3.0, potential: 86,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 85, freeThrow: 89,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 84,
            interiorDefense: 75, perimeterDefense: 65, stealing: 82, blocking: 82,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 52, inside: 75, outside: 85, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Myles', lastName: 'Cale', position: 'SG', age: 25, height: 198, weight: 95, stars: 2.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 72, threePointShot: 78, freeThrow: 77,
            playmaking: 62, ballHandling: 78, basketballIQ: 82, athleticism: 88,
            interiorDefense: 55, perimeterDefense: 78, stealing: 75, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 65, inside: 75, outside: 78, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Juani', lastName: 'Marcos', position: 'PG', age: 24, height: 190, weight: 82, stars: 2.5, potential: 84,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 82, freeThrow: 60,
            playmaking: 82, ballHandling: 85, basketballIQ: 82, athleticism: 82,
            interiorDefense: 40, perimeterDefense: 72, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 85, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Juan', lastName: 'Nunez', position: 'PG', age: 20, height: 191, weight: 86, stars: 3.0, potential: 92,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 70, freeThrow: 65,
            playmaking: 92, ballHandling: 88, basketballIQ: 94, athleticism: 80,
            interiorDefense: 40, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 70, passing: 99, inside: 55, outside: 65, defensiveAggression: 65, foulTendency: 45 } }
    ],
    // ─── FENERBAHCE (ULK) ───────────────────────────────────────────────────
    'ULK': [
        { firstName: 'Talen', lastName: 'Horton-Tucker', position: 'SG', age: 24, height: 198, weight: 106, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 82, threePointShot: 78, freeThrow: 75,
            playmaking: 78, ballHandling: 88, basketballIQ: 90, athleticism: 94,
            interiorDefense: 65, perimeterDefense: 88, stealing: 78, blocking: 55,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 95, passing: 65, inside: 85, outside: 78, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Wade', lastName: 'Baldwin IV', position: 'PG', age: 28, height: 193, weight: 91, stars: 5.0, potential: 92, contract: { amount: 2500000, years: 2 },
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 85, freeThrow: 79,
            playmaking: 99, ballHandling: 92, basketballIQ: 94, athleticism: 94,
            interiorDefense: 55, perimeterDefense: 82, stealing: 72, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 88, passing: 99, inside: 75, outside: 85, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Tarik', lastName: 'Biberovic', position: 'SF', age: 23, height: 201, weight: 95, stars: 4.5, potential: 90,
          attributes: {
            finishing: 78, midRange: 85, threePointShot: 95, freeThrow: 95,
            playmaking: 68, ballHandling: 78, basketballIQ: 92, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 75, stealing: 68, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 85, passing: 68, inside: 55, outside: 95, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Nando', lastName: 'De Colo', position: 'SG', age: 37, height: 196, weight: 91, stars: 4.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 92, threePointShot: 96, freeThrow: 97,
            playmaking: 85, ballHandling: 88, basketballIQ: 99, athleticism: 72,
            interiorDefense: 35, perimeterDefense: 68, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 85, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 40 } },
        { firstName: 'Devon', lastName: 'Hall', position: 'SG', age: 29, height: 196, weight: 95, stars: 3.5, potential: 84,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 85, freeThrow: 84,
            playmaking: 78, ballHandling: 82, basketballIQ: 90, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 85, stealing: 75, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 78, inside: 65, outside: 82, defensiveAggression: 80, foulTendency: 50 } },
        { firstName: 'Scottie', lastName: 'Wilbekin', position: 'PG', age: 31, height: 188, weight: 80, stars: 4.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 94, freeThrow: 50,
            playmaking: 82, ballHandling: 90, basketballIQ: 92, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 85, stealing: 95, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 82, inside: 55, outside: 95, defensiveAggression: 92, foulTendency: 55 } },
        { firstName: 'Bonzie', lastName: 'Colson, Jr.', position: 'SF', age: 28, height: 198, weight: 102, stars: 3.5, potential: 86,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 92, freeThrow: 90,
            playmaking: 65, ballHandling: 72, basketballIQ: 88, athleticism: 84,
            interiorDefense: 75, perimeterDefense: 82, stealing: 82, blocking: 75,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 65, inside: 75, outside: 88, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Nicolo', lastName: 'Melli', position: 'PF', age: 33, height: 205, weight: 107, stars: 3.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 88, freeThrow: 55,
            playmaking: 72, ballHandling: 75, basketballIQ: 98, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 75, stealing: 75, blocking: 72,
            offensiveRebound: 78, defensiveRebound: 88
          },
          tendencies: { shooting: 72, passing: 72, inside: 65, outside: 85, defensiveAggression: 90, foulTendency: 65 } },
        { firstName: 'Khem', lastName: 'Birch', position: 'C', age: 32, height: 206, weight: 106, stars: 3.0, potential: 80,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 68,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 82,
            interiorDefense: 88, perimeterDefense: 45, stealing: 65, blocking: 75,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Mikael', lastName: 'Jantunen', position: 'PF', age: 24, height: 203, weight: 100, stars: 2.5, potential: 86,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 82, freeThrow: 87,
            playmaking: 62, ballHandling: 72, basketballIQ: 88, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 72, stealing: 72, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 62, inside: 75, outside: 78, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'B.J.', lastName: 'Boston, Jr.', position: 'SF', age: 23, height: 201, weight: 85, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 82, freeThrow: 77,
            playmaking: 60, ballHandling: 85, basketballIQ: 82, athleticism: 88,
            interiorDefense: 55, perimeterDefense: 75, stealing: 78, blocking: 45,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 85, passing: 60, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Chris', lastName: 'Silva', position: 'PF', age: 28, height: 203, weight: 105, stars: 3.0, potential: 82,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 89,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 90,
            interiorDefense: 85, perimeterDefense: 62, stealing: 82, blocking: 65,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 52, inside: 92, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Armando', lastName: 'Bacot', position: 'C', age: 24, height: 211, weight: 111, stars: 2.5, potential: 86,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 35, freeThrow: 81,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 80,
            interiorDefense: 88, perimeterDefense: 40, stealing: 72, blocking: 88,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 65, passing: 55, inside: 95, outside: 35, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Arturs', lastName: 'Zagars', position: 'PG', age: 24, height: 190, weight: 80, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 78, threePointShot: 82, freeThrow: 80,
            playmaking: 88, ballHandling: 85, basketballIQ: 85, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 72, stealing: 92, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 88, inside: 65, outside: 82, defensiveAggression: 82, foulTendency: 50 } }
    ],
    // ─── AS MONACO (MCO) ────────────────────────────────────────────────────
    'MCO': [
        { firstName: 'Mike', lastName: 'James', position: 'PG', age: 34, height: 185, weight: 89, stars: 5.0, potential: 92, contract: { amount: 2500000, years: 3 },
          attributes: {
            finishing: 88, midRange: 92, threePointShot: 85, freeThrow: 86,
            playmaking: 99, ballHandling: 98, basketballIQ: 96, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 58
          },
          tendencies: { shooting: 95, passing: 95, inside: 65, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Alpha', lastName: 'Diallo', position: 'SF', age: 28, height: 198, weight: 103, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 78, freeThrow: 80,
            playmaking: 70, ballHandling: 75, basketballIQ: 88, athleticism: 88,
            interiorDefense: 72, perimeterDefense: 95, stealing: 88, blocking: 55,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 65, inside: 75, outside: 65, defensiveAggression: 92, foulTendency: 60 } },
        { firstName: 'Elie', lastName: 'Okobo', position: 'PG', age: 26, height: 190, weight: 82, stars: 4.5, potential: 88,
          attributes: {
            finishing: 84, midRange: 82, threePointShot: 82, freeThrow: 84,
            playmaking: 92, ballHandling: 94, basketballIQ: 88, athleticism: 84,
            interiorDefense: 40, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 88, passing: 92, inside: 65, outside: 85, defensiveAggression: 65, foulTendency: 50 } },
        { firstName: 'Nikola', lastName: 'Mirotic', position: 'PF', age: 34, height: 208, weight: 113, stars: 4.5, potential: 90, contract: { amount: 2500000, years: 2 },
          attributes: {
            finishing: 82, midRange: 88, threePointShot: 92, freeThrow: 82,
            playmaking: 72, ballHandling: 75, basketballIQ: 94, athleticism: 75,
            interiorDefense: 75, perimeterDefense: 65, stealing: 72, blocking: 55,
            offensiveRebound: 65, defensiveRebound: 85
          },
          tendencies: { shooting: 88, passing: 65, inside: 55, outside: 92, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Jaron', lastName: 'Blossomgame', position: 'PF', age: 30, height: 203, weight: 104, stars: 3.5, potential: 82,
          attributes: {
            finishing: 88, midRange: 78, threePointShot: 80, freeThrow: 65,
            playmaking: 60, ballHandling: 65, basketballIQ: 82, athleticism: 88,
            interiorDefense: 78, perimeterDefense: 72, stealing: 60, blocking: 35,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 78, passing: 55, inside: 85, outside: 72, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Daniel', lastName: 'Theis', position: 'C', age: 32, height: 208, weight: 114, stars: 4.0, potential: 85,
          attributes: {
            finishing: 85, midRange: 65, threePointShot: 72, freeThrow: 81,
            playmaking: 65, ballHandling: 68, basketballIQ: 92, athleticism: 82,
            interiorDefense: 90, perimeterDefense: 60, stealing: 65, blocking: 95,
            offensiveRebound: 88, defensiveRebound: 90
          },
          tendencies: { shooting: 65, passing: 62, inside: 85, outside: 60, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Matthew', lastName: 'Strazel', position: 'PG', age: 23, height: 188, weight: 80, stars: 3.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 88, freeThrow: 84,
            playmaking: 85, ballHandling: 88, basketballIQ: 85, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 45
          },
          tendencies: { shooting: 75, passing: 85, inside: 45, outside: 85, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Kevarrius', lastName: 'Hayes', position: 'C', age: 29, height: 208, weight: 107, stars: 3.5, potential: 82,
          attributes: {
            finishing: 88, midRange: 45, threePointShot: 25, freeThrow: 72,
            playmaking: 55, ballHandling: 60, basketballIQ: 78, athleticism: 88,
            interiorDefense: 88, perimeterDefense: 50, stealing: 75, blocking: 96,
            offensiveRebound: 92, defensiveRebound: 82
          },
          tendencies: { shooting: 55, passing: 45, inside: 95, outside: 25, defensiveAggression: 90, foulTendency: 75 } },
        { firstName: 'Yoan', lastName: 'Makoundou', position: 'PF', age: 24, height: 207, weight: 102, stars: 3.0, potential: 86,
          attributes: {
            finishing: 92, midRange: 40, threePointShot: 25, freeThrow: 92,
            playmaking: 50, ballHandling: 68, basketballIQ: 75, athleticism: 96,
            interiorDefense: 78, perimeterDefense: 72, stealing: 88, blocking: 85,
            offensiveRebound: 72, defensiveRebound: 88
          },
          tendencies: { shooting: 85, passing: 45, inside: 98, outside: 25, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Nemanja', lastName: 'Nedovic', position: 'SG', age: 33, height: 196, weight: 95, stars: 3.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 94, freeThrow: 87,
            playmaking: 75, ballHandling: 85, basketballIQ: 88, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 65, stealing: 70, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 92, passing: 72, inside: 55, outside: 95, defensiveAggression: 60, foulTendency: 45 } },
        { firstName: 'Juhann', lastName: 'Begarin', position: 'SG', age: 22, height: 196, weight: 91, stars: 2.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 65, threePointShot: 70, freeThrow: 81,
            playmaking: 65, ballHandling: 72, basketballIQ: 75, athleticism: 92,
            interiorDefense: 60, perimeterDefense: 78, stealing: 68, blocking: 75,
            offensiveRebound: 72, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 60, inside: 85, outside: 55, defensiveAggression: 82, foulTendency: 60 } },
        { firstName: 'Terry', lastName: 'Tarpey', position: 'SF', age: 31, height: 196, weight: 95, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 96, freeThrow: 62,
            playmaking: 68, ballHandling: 70, basketballIQ: 92, athleticism: 84,
            interiorDefense: 65, perimeterDefense: 92, stealing: 88, blocking: 55,
            offensiveRebound: 78, defensiveRebound: 85
          },
          tendencies: { shooting: 55, passing: 72, inside: 45, outside: 90, defensiveAggression: 95, foulTendency: 55 } }
    ],
    // ─── CRVENA ZVEZDA / RED STAR (RED) ─────────────────────────────────────
    'RED': [
        { firstName: 'Jordan', lastName: 'Nwora', position: 'SF', age: 26, height: 203, weight: 102, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 85, freeThrow: 81,
            playmaking: 72, ballHandling: 85, basketballIQ: 90, athleticism: 92,
            interiorDefense: 62, perimeterDefense: 78, stealing: 82, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 92, passing: 65, inside: 82, outside: 85, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Chima', lastName: 'Moneke', position: 'PF', age: 29, height: 196, weight: 101, stars: 4.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 75, threePointShot: 84, freeThrow: 77,
            playmaking: 68, ballHandling: 78, basketballIQ: 92, athleticism: 94,
            interiorDefense: 78, perimeterDefense: 75, stealing: 85, blocking: 55,
            offensiveRebound: 75, defensiveRebound: 85
          },
          tendencies: { shooting: 78, passing: 68, inside: 92, outside: 75, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Jared', lastName: 'Butler', position: 'PG', age: 24, height: 191, weight: 88, stars: 4.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 86, freeThrow: 81,
            playmaking: 92, ballHandling: 90, basketballIQ: 92, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 92, passing: 92, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Codi', lastName: 'Miller-McIntyre', position: 'PG', age: 30, height: 191, weight: 93, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 82, freeThrow: 61,
            playmaking: 96, ballHandling: 92, basketballIQ: 95, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 85, stealing: 82, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 65
          },
          tendencies: { shooting: 78, passing: 98, inside: 75, outside: 82, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Ebuka', lastName: 'Izundu', position: 'C', age: 28, height: 208, weight: 105, stars: 4.0, potential: 86,
          attributes: {
            finishing: 92, midRange: 35, threePointShot: 25, freeThrow: 77,
            playmaking: 52, ballHandling: 58, basketballIQ: 82, athleticism: 85,
            interiorDefense: 88, perimeterDefense: 45, stealing: 75, blocking: 88,
            offensiveRebound: 92, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 52, inside: 95, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Semi', lastName: 'Ojeleye', position: 'SF', age: 30, height: 199, weight: 109, stars: 3.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 85, freeThrow: 76,
            playmaking: 62, ballHandling: 72, basketballIQ: 88, athleticism: 94,
            interiorDefense: 82, perimeterDefense: 85, stealing: 72, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 62, inside: 78, outside: 85, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Donatas', lastName: 'Motiejunas', position: 'C', age: 34, height: 213, weight: 101, stars: 3.5, potential: 78,
          attributes: {
            finishing: 88, midRange: 75, threePointShot: 75, freeThrow: 60,
            playmaking: 68, ballHandling: 65, basketballIQ: 92, athleticism: 75,
            interiorDefense: 75, perimeterDefense: 45, stealing: 68, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 62
          },
          tendencies: { shooting: 72, passing: 68, inside: 88, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Stefan', lastName: 'Milivojevic', position: 'SG', age: 23, height: 191, weight: 85, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 82, freeThrow: 86,
            playmaking: 75, ballHandling: 82, basketballIQ: 82, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 82, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 75, inside: 65, outside: 82, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Nikola', lastName: 'Kalinic', position: 'SF', age: 33, height: 202, weight: 105, stars: 3.5, potential: 80,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 88, freeThrow: 67,
            playmaking: 72, ballHandling: 78, basketballIQ: 95, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 85, stealing: 72, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 65, passing: 75, inside: 65, outside: 82, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Joel', lastName: 'Bolomboy', position: 'C', age: 31, height: 206, weight: 106, stars: 3.5, potential: 84,
          attributes: {
            finishing: 85, midRange: 45, threePointShot: 25, freeThrow: 69,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 92,
            interiorDefense: 88, perimeterDefense: 45, stealing: 72, blocking: 88,
            offensiveRebound: 92, defensiveRebound: 92
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 95, foulTendency: 70 } },
        { firstName: 'Ognjen', lastName: 'Dobric', position: 'SF', age: 30, height: 200, weight: 93, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 88, freeThrow: 100,
            playmaking: 62, ballHandling: 75, basketballIQ: 88, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Tyson', lastName: 'Carter', position: 'SG', age: 26, height: 193, weight: 80, stars: 3.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 82, freeThrow: 100,
            playmaking: 78, ballHandling: 85, basketballIQ: 85, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 78, inside: 65, outside: 82, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Jasiel', lastName: 'Rivero', position: 'PF', age: 31, height: 206, weight: 108, stars: 3.0, potential: 80,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 69,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 82,
            interiorDefense: 82, perimeterDefense: 45, stealing: 65, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 52, inside: 92, outside: 25, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Devonte', lastName: 'Graham', position: 'PG', age: 30, height: 185, weight: 88, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 75, freeThrow: 20,
            playmaking: 82, ballHandling: 88, basketballIQ: 85, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 75, stealing: 75, blocking: 35,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 82, inside: 55, outside: 95, defensiveAggression: 70, foulTendency: 50 } }
    ],
    'PAR': [
        { firstName: 'Carlik', lastName: 'Jones', position: 'PG', age: 27, height: 185, weight: 84, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 90, threePointShot: 82, freeThrow: 90,
            playmaking: 92, ballHandling: 94, basketballIQ: 94, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 82, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 92, passing: 88, inside: 75, outside: 85, defensiveAggression: 80, foulTendency: 50 } },
        { firstName: 'Duane', lastName: 'Washington, Jr.', position: 'SG', age: 25, height: 191, weight: 89, stars: 4.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 92, freeThrow: 80,
            playmaking: 75, ballHandling: 88, basketballIQ: 88, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 99, passing: 65, inside: 65, outside: 95, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Sterling', lastName: 'Brown', position: 'SF', age: 30, height: 196, weight: 99, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 94, freeThrow: 91,
            playmaking: 72, ballHandling: 82, basketballIQ: 90, athleticism: 85,
            interiorDefense: 62, perimeterDefense: 85, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 85, passing: 72, inside: 65, outside: 92, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Cameron', lastName: 'Payne', position: 'PG', age: 30, height: 188, weight: 83, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 88, freeThrow: 86,
            playmaking: 92, ballHandling: 90, basketballIQ: 92, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 78, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 88, passing: 92, inside: 75, outside: 88, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Isaac', lastName: 'Bonga', position: 'SF', age: 25, height: 203, weight: 93, stars: 4.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 85, freeThrow: 83,
            playmaking: 75, ballHandling: 78, basketballIQ: 90, athleticism: 88,
            interiorDefense: 75, perimeterDefense: 92, stealing: 82, blocking: 75,
            offensiveRebound: 55, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 75, inside: 65, outside: 82, defensiveAggression: 95, foulTendency: 60 } },
        { firstName: 'Bruno', lastName: 'Fernando', position: 'C', age: 26, height: 206, weight: 109, stars: 4.0, potential: 88,
          attributes: {
            finishing: 90, midRange: 45, threePointShot: 50, freeThrow: 74,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 94,
            interiorDefense: 88, perimeterDefense: 45, stealing: 72, blocking: 88,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 65, passing: 52, inside: 95, outside: 45, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Jabari', lastName: 'Parker', position: 'PF', age: 29, height: 203, weight: 111, stars: 4.0, potential: 84,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 82, freeThrow: 95,
            playmaking: 68, ballHandling: 82, basketballIQ: 88, athleticism: 85,
            interiorDefense: 72, perimeterDefense: 65, stealing: 75, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 88, passing: 68, inside: 85, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Tonye', lastName: 'Jekiri', position: 'C', age: 30, height: 213, weight: 103, stars: 3.5, potential: 80,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 25, freeThrow: 70,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 82,
            interiorDefense: 88, perimeterDefense: 45, stealing: 72, blocking: 78,
            offensiveRebound: 88, defensiveRebound: 88
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Dylan', lastName: 'Osetkowski', position: 'PF', age: 28, height: 206, weight: 105, stars: 3.5, potential: 84,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 88, freeThrow: 88,
            playmaking: 62, ballHandling: 72, basketballIQ: 90, athleticism: 80,
            interiorDefense: 75, perimeterDefense: 72, stealing: 85, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 62, inside: 75, outside: 88, defensiveAggression: 82, foulTendency: 60 } },
        { firstName: 'Shake', lastName: 'Milton', position: 'SG', age: 28, height: 196, weight: 93, stars: 3.5, potential: 84,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 78, freeThrow: 85,
            playmaking: 85, ballHandling: 88, basketballIQ: 88, athleticism: 84,
            interiorDefense: 45, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 85, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Nick', lastName: 'Calathes', position: 'PG', age: 36, height: 198, weight: 97, stars: 4.0, potential: 80,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 82, freeThrow: 56,
            playmaking: 98, ballHandling: 92, basketballIQ: 99, athleticism: 75,
            interiorDefense: 45, perimeterDefense: 90, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 60, passing: 99, inside: 55, outside: 75, defensiveAggression: 92, foulTendency: 45 } },
        { firstName: 'Aleksej', lastName: 'Pokusevski', position: 'PF', age: 23, height: 213, weight: 86, stars: 3.0, potential: 92,
          attributes: {
            finishing: 78, midRange: 78, threePointShot: 85, freeThrow: 100,
            playmaking: 72, ballHandling: 78, basketballIQ: 88, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 72, stealing: 72, blocking: 85,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 72, inside: 65, outside: 82, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Vanja', lastName: 'Marinkovic', position: 'SG', age: 28, height: 198, weight: 91, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 78,
            playmaking: 68, ballHandling: 82, basketballIQ: 88, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 75, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 68, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 50 } }
    ],
    // ─── FC BAYERN MUNICH (MUN) ─────────────────────────────────────────────
    'MUN': [
        { firstName: 'Andreas', lastName: 'Obst', position: 'SG', age: 28, height: 191, weight: 89, stars: 4.5, potential: 88,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 95, freeThrow: 89,
            playmaking: 70, ballHandling: 78, basketballIQ: 92, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 72, stealing: 65, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 95, passing: 65, inside: 55, outside: 99, defensiveAggression: 65, foulTendency: 40 } },
        { firstName: 'Spencer', lastName: 'Dinwiddie', position: 'PG', age: 31, height: 196, weight: 100, stars: 4.0, potential: 88,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 85, freeThrow: 81,
            playmaking: 85, ballHandling: 92, basketballIQ: 88, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 75, stealing: 68, blocking: 35,
            offensiveRebound: 42, defensiveRebound: 55
          },
          tendencies: { shooting: 85, passing: 82, inside: 75, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Nenad', lastName: 'Dimitrijevic', position: 'PG', age: 26, height: 191, weight: 84, stars: 4.5, potential: 90,
          attributes: {
            finishing: 82, midRange: 88, threePointShot: 96, freeThrow: 82,
            playmaking: 92, ballHandling: 90, basketballIQ: 94, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 78, stealing: 82, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 82, passing: 92, inside: 60, outside: 95, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Isiaha', lastName: 'Mike', position: 'PF', age: 27, height: 206, weight: 106, stars: 4.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 94, freeThrow: 73,
            playmaking: 65, ballHandling: 72, basketballIQ: 85, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 65, stealing: 78, blocking: 55,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 85, passing: 65, inside: 65, outside: 92, defensiveAggression: 82, foulTendency: 60 } },
        { firstName: 'Justinian', lastName: 'Jessup', position: 'SF', age: 27, height: 200, weight: 95, stars: 3.5, potential: 88,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 88, freeThrow: 97,
            playmaking: 65, ballHandling: 78, basketballIQ: 88, athleticism: 78,
            interiorDefense: 55, perimeterDefense: 72, stealing: 75, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 82, passing: 65, inside: 55, outside: 88, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Vladimir', lastName: 'Lucic', position: 'SF', age: 36, height: 202, weight: 103, stars: 3.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 87,
            playmaking: 65, ballHandling: 75, basketballIQ: 95, athleticism: 75,
            interiorDefense: 68, perimeterDefense: 82, stealing: 72, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 65, inside: 65, outside: 82, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'David', lastName: 'McCormack', position: 'C', age: 25, height: 208, weight: 113, stars: 3.5, potential: 84,
          attributes: {
            finishing: 88, midRange: 55, threePointShot: 25, freeThrow: 71,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 45, stealing: 92, blocking: 45,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 52, inside: 92, outside: 25, defensiveAggression: 92, foulTendency: 70 } },
        { firstName: 'Stefan', lastName: 'Jovic', position: 'PG', age: 34, height: 198, weight: 94, stars: 3.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 88, freeThrow: 75,
            playmaking: 98, ballHandling: 90, basketballIQ: 99, athleticism: 80,
            interiorDefense: 55, perimeterDefense: 92, stealing: 96, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 65, passing: 98, inside: 55, outside: 82, defensiveAggression: 98, foulTendency: 50 } },
        { firstName: 'Oscar', lastName: 'da Silva', position: 'PF', age: 26, height: 206, weight: 104, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 35, threePointShot: 25, freeThrow: 92,
            playmaking: 60, ballHandling: 62, basketballIQ: 88, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 65, stealing: 75, blocking: 75,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 62, inside: 85, outside: 25, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Wenyen', lastName: 'Gabriel', position: 'PF', age: 27, height: 206, weight: 100, stars: 3.5, potential: 82,
          attributes: {
            finishing: 85, midRange: 45, threePointShot: 25, freeThrow: 45,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 92,
            interiorDefense: 88, perimeterDefense: 65, stealing: 72, blocking: 99,
            offensiveRebound: 92, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 55, inside: 88, outside: 25, defensiveAggression: 95, foulTendency: 70 } },
        { firstName: 'Kamar', lastName: 'Baldwin', position: 'PG', age: 27, height: 185, weight: 86, stars: 3.0, potential: 84,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 85, freeThrow: 91,
            playmaking: 85, ballHandling: 88, basketballIQ: 85, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 75, stealing: 88, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 82, inside: 65, outside: 85, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Johannes', lastName: 'Voigtmann', position: 'PF', age: 32, height: 211, weight: 108, stars: 3.0, potential: 80,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 75,
            playmaking: 82, ballHandling: 72, basketballIQ: 95, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 65, stealing: 68, blocking: 55,
            offensiveRebound: 72, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 82, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Justus', lastName: 'Hollatz', position: 'PG', age: 23, height: 191, weight: 82, stars: 2.5, potential: 88,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 73,
            playmaking: 85, ballHandling: 82, basketballIQ: 85, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 78, stealing: 85, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 52
          },
          tendencies: { shooting: 65, passing: 85, inside: 55, outside: 75, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Xavier', lastName: 'Rathan-Mayes', position: 'SG', age: 30, height: 193, weight: 94, stars: 3.0, potential: 80,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 72, freeThrow: 71,
            playmaking: 82, ballHandling: 85, basketballIQ: 88, athleticism: 84,
            interiorDefense: 45, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 38, defensiveRebound: 48
          },
          tendencies: { shooting: 92, passing: 78, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 50 } }
    ],
    // ─── EA7 EMPORIO ARMANI MILAN (MIL) ─────────────────────────────────────
    'MIL': [
        { firstName: 'Zach', lastName: 'LeDay', position: 'PF', age: 30, height: 202, weight: 103, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 98, freeThrow: 82,
            playmaking: 65, ballHandling: 72, basketballIQ: 92, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 65, stealing: 60, blocking: 55,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 85, passing: 55, inside: 65, outside: 95, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Armoni', lastName: 'Brooks', position: 'SG', age: 26, height: 191, weight: 88, stars: 4.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 84, threePointShot: 94, freeThrow: 82,
            playmaking: 68, ballHandling: 82, basketballIQ: 85, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 92, passing: 65, inside: 55, outside: 95, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Shavon', lastName: 'Shields', position: 'SF', age: 30, height: 201, weight: 100, stars: 4.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 88, freeThrow: 88,
            playmaking: 78, ballHandling: 85, basketballIQ: 94, athleticism: 84,
            interiorDefense: 65, perimeterDefense: 85, stealing: 78, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 85, passing: 75, inside: 72, outside: 85, defensiveAggression: 80, foulTendency: 50 } },
        { firstName: 'Josh', lastName: 'Nebo', position: 'C', age: 27, height: 206, weight: 111, stars: 4.5, potential: 88,
          attributes: {
            finishing: 94, midRange: 35, threePointShot: 25, freeThrow: 66,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 96,
            interiorDefense: 88, perimeterDefense: 50, stealing: 65, blocking: 92,
            offensiveRebound: 95, defensiveRebound: 90
          },
          tendencies: { shooting: 75, passing: 45, inside: 98, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Marko', lastName: 'Guduric', position: 'SG', age: 29, height: 196, weight: 91, stars: 4.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 88, freeThrow: 90,
            playmaking: 88, ballHandling: 88, basketballIQ: 92, athleticism: 80,
            interiorDefense: 55, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 82, passing: 88, inside: 60, outside: 88, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Leandro', lastName: 'Bolmaro', position: 'PG', age: 24, height: 198, weight: 91, stars: 3.5, potential: 88,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 90, freeThrow: 81,
            playmaking: 85, ballHandling: 88, basketballIQ: 88, athleticism: 88,
            interiorDefense: 55, perimeterDefense: 85, stealing: 82, blocking: 25,
            offensiveRebound: 48, defensiveRebound: 58
          },
          tendencies: { shooting: 80, passing: 85, inside: 65, outside: 82, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Quinn', lastName: 'Ellis', position: 'PG', age: 22, height: 193, weight: 88, stars: 3.0, potential: 86,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 88, freeThrow: 82,
            playmaking: 88, ballHandling: 85, basketballIQ: 85, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 52
          },
          tendencies: { shooting: 75, passing: 92, inside: 55, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Devin', lastName: 'Booker', position: 'PF', age: 33, height: 205, weight: 113, stars: 3.0, potential: 78,
          attributes: {
            finishing: 85, midRange: 75, threePointShot: 65, freeThrow: 76,
            playmaking: 60, ballHandling: 65, basketballIQ: 85, athleticism: 78,
            interiorDefense: 82, perimeterDefense: 62, stealing: 65, blocking: 55,
            offensiveRebound: 82, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 65, inside: 85, outside: 60, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Lorenzo', lastName: 'Brown', position: 'PG', age: 34, height: 196, weight: 86, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 88, threePointShot: 85, freeThrow: 99,
            playmaking: 98, ballHandling: 96, basketballIQ: 96, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 88, stealing: 95, blocking: 35,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 82, passing: 98, inside: 60, outside: 85, defensiveAggression: 88, foulTendency: 45 } },
        { firstName: 'Giampaolo', lastName: 'Ricci', position: 'PF', age: 33, height: 202, weight: 102, stars: 2.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 92, freeThrow: 75,
            playmaking: 60, ballHandling: 62, basketballIQ: 92, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 68, stealing: 65, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 62, inside: 55, outside: 92, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Nico', lastName: 'Mannion', position: 'PG', age: 23, height: 191, weight: 86, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 85, freeThrow: 56,
            playmaking: 85, ballHandling: 88, basketballIQ: 82, athleticism: 90,
            interiorDefense: 40, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 85, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Bryant', lastName: 'Dunston', position: 'C', age: 38, height: 203, weight: 114, stars: 3.0, potential: 75,
          attributes: {
            finishing: 82, midRange: 55, threePointShot: 25, freeThrow: 74,
            playmaking: 58, ballHandling: 55, basketballIQ: 98, athleticism: 65,
            interiorDefense: 92, perimeterDefense: 45, stealing: 72, blocking: 99,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 55, passing: 58, inside: 85, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Ousmane', lastName: 'Diop', position: 'C', age: 24, height: 204, weight: 115, stars: 2.5, potential: 84,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 25, freeThrow: 99,
            playmaking: 55, ballHandling: 58, basketballIQ: 78, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 40, stealing: 60, blocking: 99,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 55, passing: 45, inside: 92, outside: 25, defensiveAggression: 90, foulTendency: 70 } },
        { firstName: 'Stefano', lastName: 'Tonut', position: 'SG', age: 31, height: 194, weight: 100, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 75,
            playmaking: 68, ballHandling: 75, basketballIQ: 88, athleticism: 84,
            interiorDefense: 65, perimeterDefense: 90, stealing: 92, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 65, passing: 68, inside: 60, outside: 75, defensiveAggression: 95, foulTendency: 55 } }
    ],
    // ─── MACCABI TEL AVIV (TEL) ─────────────────────────────────────────────
    'TEL': [
        { firstName: 'Lonnie', lastName: 'Walker', position: 'SG', age: 25, height: 193, weight: 93, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 85, freeThrow: 76,
            playmaking: 78, ballHandling: 90, basketballIQ: 90, athleticism: 95,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 35,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 95, passing: 68, inside: 75, outside: 92, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Roman', lastName: 'Sorkin', position: 'C', age: 28, height: 208, weight: 104, stars: 4.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 78, threePointShot: 84, freeThrow: 82,
            playmaking: 65, ballHandling: 68, basketballIQ: 92, athleticism: 85,
            interiorDefense: 82, perimeterDefense: 45, stealing: 72, blocking: 85,
            offensiveRebound: 68, defensiveRebound: 75
          },
          tendencies: { shooting: 88, passing: 65, inside: 92, outside: 75, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Gabriel', lastName: 'Lundberg', position: 'SG', age: 29, height: 193, weight: 92, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 82, freeThrow: 86,
            playmaking: 82, ballHandling: 85, basketballIQ: 92, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 85, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 85, inside: 65, outside: 88, defensiveAggression: 85, foulTendency: 45 } },
        { firstName: 'Jimmy', lastName: 'Clark III', position: 'PG', age: 24, height: 191, weight: 84, stars: 4.0, potential: 90,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 80, freeThrow: 80,
            playmaking: 94, ballHandling: 92, basketballIQ: 88, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 88, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 94, inside: 60, outside: 82, defensiveAggression: 95, foulTendency: 55 } },
        { firstName: 'Jaylen', lastName: 'Hoard', position: 'PF', age: 26, height: 203, weight: 98, stars: 4.0, potential: 88,
          attributes: {
            finishing: 92, midRange: 65, threePointShot: 75, freeThrow: 86,
            playmaking: 62, ballHandling: 72, basketballIQ: 88, athleticism: 92,
            interiorDefense: 82, perimeterDefense: 75, stealing: 78, blocking: 45,
            offensiveRebound: 82, defensiveRebound: 88
          },
          tendencies: { shooting: 78, passing: 62, inside: 92, outside: 65, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Tamir', lastName: 'Blatt', position: 'PG', age: 27, height: 185, weight: 82, stars: 4.0, potential: 86,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 92, freeThrow: 77,
            playmaking: 99, ballHandling: 90, basketballIQ: 98, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 72, passing: 99, inside: 55, outside: 95, defensiveAggression: 65, foulTendency: 40 } },
        { firstName: 'T.J.', lastName: 'Leaf', position: 'PF', age: 27, height: 208, weight: 102, stars: 3.5, potential: 82,
          attributes: {
            finishing: 88, midRange: 75, threePointShot: 85, freeThrow: 85,
            playmaking: 65, ballHandling: 68, basketballIQ: 88, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 55, stealing: 68, blocking: 78,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 75, passing: 65, inside: 88, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Oshae', lastName: 'Brissett', position: 'SF', age: 26, height: 201, weight: 95, stars: 3.5, potential: 86,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 82, freeThrow: 82,
            playmaking: 62, ballHandling: 75, basketballIQ: 90, athleticism: 88,
            interiorDefense: 72, perimeterDefense: 82, stealing: 78, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 62, inside: 75, outside: 82, defensiveAggression: 85, foulTendency: 60 } },
        { firstName: 'Jeff', lastName: 'Dowtin', position: 'PG', age: 27, height: 191, weight: 80, stars: 3.5, potential: 84,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 88, freeThrow: 71,
            playmaking: 82, ballHandling: 88, basketballIQ: 85, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 82, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Zach', lastName: 'Hankins', position: 'C', age: 28, height: 211, weight: 111, stars: 3.5, potential: 80,
          attributes: {
            finishing: 95, midRange: 35, threePointShot: 25, freeThrow: 67,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 40, stealing: 65, blocking: 92,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 55, passing: 52, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Marcio', lastName: 'Santos', position: 'C', age: 22, height: 206, weight: 102, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 65, threePointShot: 80, freeThrow: 80,
            playmaking: 62, ballHandling: 65, basketballIQ: 82, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 45, stealing: 75, blocking: 78,
            offensiveRebound: 65, defensiveRebound: 62
          },
          tendencies: { shooting: 72, passing: 62, inside: 82, outside: 75, defensiveAggression: 80, foulTendency: 70 } },
        { firstName: 'John', lastName: 'DiBartolomeo', position: 'SG', age: 33, height: 183, weight: 79, stars: 3.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 88, freeThrow: 86,
            playmaking: 75, ballHandling: 82, basketballIQ: 92, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 85, stealing: 95, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 48
          },
          tendencies: { shooting: 72, passing: 78, inside: 55, outside: 95, defensiveAggression: 92, foulTendency: 50 } },
        { firstName: 'Cliff', lastName: 'Omoruyi', position: 'C', age: 22, height: 211, weight: 109, stars: 3.0, potential: 90,
          attributes: {
            finishing: 88, midRange: 25, threePointShot: 25, freeThrow: 100,
            playmaking: 45, ballHandling: 52, basketballIQ: 82, athleticism: 90,
            interiorDefense: 85, perimeterDefense: 35, stealing: 62, blocking: 82,
            offensiveRebound: 99, defensiveRebound: 92
          },
          tendencies: { shooting: 50, passing: 45, inside: 95, outside: 25, defensiveAggression: 92, foulTendency: 75 } }
    ],
    // ─── BASKONIA (BAS) ─────────────────────────────────────────────────────
    'BAS': [
        { firstName: 'Timothe', lastName: 'Luwawu-Cabarrot', position: 'SF', age: 29, height: 201, weight: 98, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 92, freeThrow: 90,
            playmaking: 75, ballHandling: 85, basketballIQ: 92, athleticism: 88,
            interiorDefense: 62, perimeterDefense: 85, stealing: 78, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 94, passing: 65, inside: 75, outside: 92, defensiveAggression: 80, foulTendency: 50 } },
        { firstName: 'Hamidou', lastName: 'Diallo', position: 'SG', age: 26, height: 196, weight: 92, stars: 4.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 65, threePointShot: 25, freeThrow: 69,
            playmaking: 68, ballHandling: 82, basketballIQ: 82, athleticism: 99,
            interiorDefense: 55, perimeterDefense: 82, stealing: 85, blocking: 55,
            offensiveRebound: 72, defensiveRebound: 78
          },
          tendencies: { shooting: 88, passing: 60, inside: 98, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Kobi', lastName: 'Simmons', position: 'PG', age: 27, height: 196, weight: 86, stars: 4.0, potential: 88,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 75, freeThrow: 91,
            playmaking: 85, ballHandling: 88, basketballIQ: 85, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 82, inside: 72, outside: 75, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Trent', lastName: 'Forrest', position: 'PG', age: 26, height: 193, weight: 95, stars: 4.0, potential: 88,
          attributes: {
            finishing: 85, midRange: 80, threePointShot: 75, freeThrow: 86,
            playmaking: 92, ballHandling: 88, basketballIQ: 92, athleticism: 88,
            interiorDefense: 55, perimeterDefense: 88, stealing: 85, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 92, inside: 75, outside: 75, defensiveAggression: 88, foulTendency: 50 } },
        { firstName: 'Eugene', lastName: 'Omoruyi', position: 'PF', age: 27, height: 198, weight: 107, stars: 4.0, potential: 86,
          attributes: {
            finishing: 88, midRange: 78, threePointShot: 80, freeThrow: 78,
            playmaking: 65, ballHandling: 75, basketballIQ: 85, athleticism: 90,
            interiorDefense: 78, perimeterDefense: 72, stealing: 75, blocking: 45,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 88, passing: 65, inside: 85, outside: 78, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Markus', lastName: 'Howard', position: 'SG', age: 25, height: 178, weight: 79, stars: 4.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 85, threePointShot: 88, freeThrow: 81,
            playmaking: 75, ballHandling: 90, basketballIQ: 88, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 68, stealing: 68, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 95, passing: 72, inside: 55, outside: 95, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Mamadi', lastName: 'Diakite', position: 'PF', age: 28, height: 206, weight: 103, stars: 3.5, potential: 82,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 82, freeThrow: 83,
            playmaking: 55, ballHandling: 65, basketballIQ: 88, athleticism: 88,
            interiorDefense: 85, perimeterDefense: 65, stealing: 75, blocking: 99,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 78, passing: 55, inside: 82, outside: 82, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Tadas', lastName: 'Sedekerskis', position: 'SF', age: 26, height: 204, weight: 101, stars: 3.5, potential: 84,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 75, freeThrow: 54,
            playmaking: 68, ballHandling: 72, basketballIQ: 90, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 78, stealing: 65, blocking: 35,
            offensiveRebound: 65, defensiveRebound: 85
          },
          tendencies: { shooting: 72, passing: 75, inside: 75, outside: 75, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Rodions', lastName: 'Kurucs', position: 'SF', age: 26, height: 206, weight: 104, stars: 3.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 88, freeThrow: 67,
            playmaking: 65, ballHandling: 75, basketballIQ: 88, athleticism: 84,
            interiorDefense: 72, perimeterDefense: 85, stealing: 92, blocking: 45,
            offensiveRebound: 72, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 68, inside: 70, outside: 88, defensiveAggression: 95, foulTendency: 60 } },
        { firstName: 'Markquis', lastName: 'Nowell', position: 'PG', age: 25, height: 172, weight: 73, stars: 3.0, potential: 86,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 80, freeThrow: 81,
            playmaking: 94, ballHandling: 92, basketballIQ: 90, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 75, stealing: 88, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 95, inside: 55, outside: 80, defensiveAggression: 82, foulTendency: 45 } },
        { firstName: 'Matteo', lastName: 'Spagnolo', position: 'PG', age: 21, height: 193, weight: 89, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 85, freeThrow: 79,
            playmaking: 82, ballHandling: 85, basketballIQ: 88, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 38, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 82, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Khalifa', lastName: 'Diop', position: 'C', age: 22, height: 211, weight: 105, stars: 3.0, potential: 88,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 56,
            playmaking: 55, ballHandling: 55, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 40, stealing: 65, blocking: 95,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Gytis', lastName: 'Radzevicius', position: 'SF', age: 29, height: 197, weight: 91, stars: 2.5, potential: 78,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 86,
            playmaking: 60, ballHandling: 72, basketballIQ: 88, athleticism: 78,
            interiorDefense: 65, perimeterDefense: 72, stealing: 68, blocking: 35,
            offensiveRebound: 62, defensiveRebound: 68
          },
          tendencies: { shooting: 72, passing: 62, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Clement', lastName: 'Frisch', position: 'PF', age: 22, height: 201, weight: 98, stars: 2.5, potential: 84,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 92, freeThrow: 99,
            playmaking: 55, ballHandling: 62, basketballIQ: 78, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 62, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 52, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 55 } }
    ],
    // ─── ASVEL (ASV) ────────────────────────────────────────────────────────
    'ASV': [
        { firstName: 'Braian', lastName: 'Angola-Rodas', position: 'SG', age: 30, height: 198, weight: 91, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 82, freeThrow: 85,
            playmaking: 82, ballHandling: 88, basketballIQ: 88, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 78, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 62
          },
          tendencies: { shooting: 92, passing: 75, inside: 60, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Glynn', lastName: 'Watson', position: 'PG', age: 27, height: 185, weight: 79, stars: 4.0, potential: 86,
          attributes: {
            finishing: 80, midRange: 88, threePointShot: 92, freeThrow: 84,
            playmaking: 78, ballHandling: 88, basketballIQ: 85, athleticism: 88,
            interiorDefense: 40, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 52
          },
          tendencies: { shooting: 88, passing: 78, inside: 45, outside: 92, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Thomas', lastName: 'Heurtel', position: 'PG', age: 35, height: 189, weight: 82, stars: 4.0, potential: 84,
          attributes: {
            finishing: 75, midRange: 85, threePointShot: 87, freeThrow: 80,
            playmaking: 98, ballHandling: 92, basketballIQ: 96, athleticism: 75,
            interiorDefense: 35, perimeterDefense: 68, stealing: 68, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 99, inside: 45, outside: 88, defensiveAggression: 60, foulTendency: 40 } },
        { firstName: 'Shaquille', lastName: 'Harrison', position: 'PG', age: 31, height: 193, weight: 86, stars: 3.5, potential: 82,
          attributes: {
            finishing: 85, midRange: 72, threePointShot: 70, freeThrow: 63,
            playmaking: 75, ballHandling: 82, basketballIQ: 88, athleticism: 94,
            interiorDefense: 62, perimeterDefense: 96, stealing: 98, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 72, inside: 85, outside: 45, defensiveAggression: 98, foulTendency: 65 } },
        { firstName: 'Mbaye', lastName: 'N\'Diaye', position: 'PF', age: 26, height: 203, weight: 98, stars: 3.5, potential: 85,
          attributes: {
            finishing: 82, midRange: 55, threePointShot: 45, freeThrow: 55,
            playmaking: 60, ballHandling: 68, basketballIQ: 82, athleticism: 92,
            interiorDefense: 85, perimeterDefense: 82, stealing: 88, blocking: 99,
            offensiveRebound: 82, defensiveRebound: 88
          },
          tendencies: { shooting: 65, passing: 60, inside: 88, outside: 45, defensiveAggression: 92, foulTendency: 70 } },
        { firstName: 'Paul', lastName: 'Eboua', position: 'PF', age: 24, height: 203, weight: 101, stars: 3.0, potential: 84,
          attributes: {
            finishing: 85, midRange: 75, threePointShot: 90, freeThrow: 65,
            playmaking: 55, ballHandling: 62, basketballIQ: 78, athleticism: 90,
            interiorDefense: 78, perimeterDefense: 65, stealing: 62, blocking: 55,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 78, passing: 52, inside: 82, outside: 88, defensiveAggression: 75, foulTendency: 60 } },
        { firstName: 'Zac', lastName: 'Seljaas', position: 'SF', age: 27, height: 201, weight: 98, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 80, freeThrow: 91,
            playmaking: 65, ballHandling: 72, basketballIQ: 85, athleticism: 82,
            interiorDefense: 65, perimeterDefense: 78, stealing: 72, blocking: 35,
            offensiveRebound: 72, defensiveRebound: 78
          },
          tendencies: { shooting: 75, passing: 68, inside: 60, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Edwin', lastName: 'Jackson', position: 'SG', age: 35, height: 190, weight: 91, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 92, freeThrow: 67,
            playmaking: 70, ballHandling: 78, basketballIQ: 88, athleticism: 78,
            interiorDefense: 45, perimeterDefense: 68, stealing: 62, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 85, passing: 72, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Melvin', lastName: 'Ajinca', position: 'SF', age: 20, height: 202, weight: 98, stars: 3.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 82, freeThrow: 80,
            playmaking: 62, ballHandling: 72, basketballIQ: 80, athleticism: 88,
            interiorDefense: 62, perimeterDefense: 80, stealing: 75, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 65
          },
          tendencies: { shooting: 80, passing: 65, inside: 75, outside: 82, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Armel', lastName: 'Traore', position: 'PF', age: 21, height: 203, weight: 95, stars: 2.5, potential: 84,
          attributes: {
            finishing: 88, midRange: 70, threePointShot: 85, freeThrow: 67,
            playmaking: 55, ballHandling: 65, basketballIQ: 78, athleticism: 88,
            interiorDefense: 75, perimeterDefense: 65, stealing: 72, blocking: 65,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 55, inside: 85, outside: 75, defensiveAggression: 75, foulTendency: 60 } },
        { firstName: 'Bastien', lastName: 'Vautier', position: 'C', age: 26, height: 210, weight: 108, stars: 2.5, potential: 80,
          attributes: {
            finishing: 88, midRange: 60, threePointShot: 25, freeThrow: 67,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 45, stealing: 60, blocking: 75,
            offensiveRebound: 88, defensiveRebound: 82
          },
          tendencies: { shooting: 65, passing: 55, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Bodian', lastName: 'Massa', position: 'C', age: 27, height: 210, weight: 100, stars: 2.0, potential: 78,
          attributes: {
            finishing: 85, midRange: 55, threePointShot: 25, freeThrow: 54,
            playmaking: 52, ballHandling: 55, basketballIQ: 82, athleticism: 82,
            interiorDefense: 82, perimeterDefense: 45, stealing: 65, blocking: 82,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 60, passing: 50, inside: 90, outside: 25, defensiveAggression: 82, foulTendency: 70 } },
        { firstName: 'David', lastName: 'Lighty', position: 'SF', age: 36, height: 198, weight: 98, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 82, freeThrow: 72,
            playmaking: 75, ballHandling: 78, basketballIQ: 95, athleticism: 75,
            interiorDefense: 65, perimeterDefense: 85, stealing: 78, blocking: 35,
            offensiveRebound: 62, defensiveRebound: 65
          },
          tendencies: { shooting: 65, passing: 78, inside: 65, outside: 82, defensiveAggression: 85, foulTendency: 50 } }
    ],
    'PRS': [
        { firstName: 'Nadir', lastName: 'Hifi', position: 'SG', age: 22, height: 184, weight: 82, stars: 5.0, potential: 95,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 85, freeThrow: 84,
            playmaking: 92, ballHandling: 94, basketballIQ: 92, athleticism: 94,
            interiorDefense: 35, perimeterDefense: 72, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 99, passing: 88, inside: 75, outside: 85, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Justin', lastName: 'Robinson', position: 'PG', age: 28, height: 185, weight: 88, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 84, freeThrow: 83,
            playmaking: 96, ballHandling: 92, basketballIQ: 92, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 85, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 92, passing: 96, inside: 60, outside: 84, defensiveAggression: 85, foulTendency: 45 } },
        { firstName: 'Jared', lastName: 'Rhoden', position: 'SF', age: 25, height: 198, weight: 95, stars: 4.0, potential: 90,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 89, freeThrow: 78,
            playmaking: 65, ballHandling: 82, basketballIQ: 88, athleticism: 88,
            interiorDefense: 62, perimeterDefense: 78, stealing: 85, blocking: 45,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 85, passing: 65, inside: 75, outside: 89, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Lamar', lastName: 'Stevens', position: 'PF', age: 27, height: 201, weight: 104, stars: 3.5, potential: 84,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 75, freeThrow: 79,
            playmaking: 62, ballHandling: 72, basketballIQ: 90, athleticism: 92,
            interiorDefense: 82, perimeterDefense: 78, stealing: 72, blocking: 78,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 78, passing: 62, inside: 78, outside: 75, defensiveAggression: 88, foulTendency: 60 } },
        { firstName: 'Allan Julien', lastName: 'Dokossi', position: 'PF', age: 25, height: 203, weight: 97, stars: 3.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 35, threePointShot: 25, freeThrow: 41,
            playmaking: 75, ballHandling: 72, basketballIQ: 88, athleticism: 90,
            interiorDefense: 78, perimeterDefense: 75, stealing: 99, blocking: 45,
            offensiveRebound: 92, defensiveRebound: 95
          },
          tendencies: { shooting: 65, passing: 75, inside: 92, outside: 25, defensiveAggression: 95, foulTendency: 65 } },
        { firstName: 'Mouhamed', lastName: 'Faye', position: 'C', age: 19, height: 208, weight: 102, stars: 3.5, potential: 95,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 25, freeThrow: 49,
            playmaking: 52, ballHandling: 55, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 40, stealing: 72, blocking: 99,
            offensiveRebound: 95, defensiveRebound: 88
          },
          tendencies: { shooting: 55, passing: 45, inside: 92, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Ismael', lastName: 'Bako', position: 'C', age: 29, height: 208, weight: 95, stars: 3.5, potential: 82,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 44,
            playmaking: 52, ballHandling: 55, basketballIQ: 85, athleticism: 84,
            interiorDefense: 88, perimeterDefense: 35, stealing: 78, blocking: 99,
            offensiveRebound: 82, defensiveRebound: 75
          },
          tendencies: { shooting: 50, passing: 45, inside: 95, outside: 25, defensiveAggression: 95, foulTendency: 70 } },
        { firstName: 'Amath', lastName: 'M\'Baye', position: 'PF', age: 35, height: 206, weight: 102, stars: 3.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 80,
            playmaking: 68, ballHandling: 72, basketballIQ: 92, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 75, blocking: 45,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 68, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Sebastian', lastName: 'Herrera', position: 'SG', age: 27, height: 193, weight: 93, stars: 3.0, potential: 84,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 87, freeThrow: 90,
            playmaking: 75, ballHandling: 82, basketballIQ: 88, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 75, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 75, inside: 65, outside: 87, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Yakuba', lastName: 'Ouattara', position: 'SG', age: 32, height: 192, weight: 84, stars: 3.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 90, freeThrow: 75,
            playmaking: 68, ballHandling: 78, basketballIQ: 88, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 85, stealing: 78, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 48
          },
          tendencies: { shooting: 82, passing: 68, inside: 65, outside: 90, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Derek', lastName: 'Willis', position: 'PF', age: 29, height: 206, weight: 104, stars: 3.0, potential: 82,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 87, freeThrow: 81,
            playmaking: 68, ballHandling: 72, basketballIQ: 88, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 75,
            offensiveRebound: 62, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 68, inside: 65, outside: 87, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Jeremy', lastName: 'Morgan', position: 'SF', age: 29, height: 196, weight: 88, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 92, freeThrow: 79,
            playmaking: 75, ballHandling: 82, basketballIQ: 90, athleticism: 84,
            interiorDefense: 55, perimeterDefense: 82, stealing: 85, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 62
          },
          tendencies: { shooting: 75, passing: 75, inside: 65, outside: 92, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Daulton', lastName: 'Hommes', position: 'SF', age: 28, height: 203, weight: 98, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 95, freeThrow: 76,
            playmaking: 62, ballHandling: 72, basketballIQ: 88, athleticism: 80,
            interiorDefense: 55, perimeterDefense: 65, stealing: 68, blocking: 45,
            offensiveRebound: 42, defensiveRebound: 48
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 95, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Leopold', lastName: 'Cavaliere', position: 'PF', age: 28, height: 203, weight: 95, stars: 2.5, potential: 78,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 65, freeThrow: 56,
            playmaking: 65, ballHandling: 72, basketballIQ: 92, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 72, stealing: 78, blocking: 35,
            offensiveRebound: 65, defensiveRebound: 68
          },
          tendencies: { shooting: 65, passing: 72, inside: 75, outside: 65, defensiveAggression: 82, foulTendency: 60 } }
    ],
    // ─── ZALGIRIS KAUNAS (ZAL) ──────────────────────────────────────────────
    'ZAL': [
        { firstName: 'Sylvain', lastName: 'Francisco', position: 'PG', age: 27, height: 185, weight: 82, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 88, freeThrow: 80,
            playmaking: 95, ballHandling: 92, basketballIQ: 92, athleticism: 95,
            interiorDefense: 35, perimeterDefense: 75, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 92, passing: 95, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Moses', lastName: 'Wright', position: 'C', age: 26, height: 206, weight: 104, stars: 4.5, potential: 92,
          attributes: {
            finishing: 92, midRange: 35, threePointShot: 31, freeThrow: 73,
            playmaking: 55, ballHandling: 62, basketballIQ: 88, athleticism: 92,
            interiorDefense: 85, perimeterDefense: 45, stealing: 75, blocking: 85,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 78, passing: 52, inside: 95, outside: 31, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Azuolas', lastName: 'Tubelis', position: 'PF', age: 23, height: 205, weight: 110, stars: 4.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 82, threePointShot: 88, freeThrow: 71,
            playmaking: 62, ballHandling: 72, basketballIQ: 88, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 65, stealing: 72, blocking: 78,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 82, passing: 62, inside: 85, outside: 88, defensiveAggression: 75, foulTendency: 60 } },
        { firstName: 'Nigel', lastName: 'Williams-Goss', position: 'PG', age: 30, height: 191, weight: 86, stars: 4.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 88, freeThrow: 79,
            playmaking: 88, ballHandling: 88, basketballIQ: 94, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 82, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 88, inside: 65, outside: 88, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Maodo', lastName: 'Lo', position: 'PG', age: 32, height: 191, weight: 82, stars: 3.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 89, freeThrow: 80,
            playmaking: 82, ballHandling: 88, basketballIQ: 90, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 82, inside: 65, outside: 89, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Arnas', lastName: 'Butkevicius', position: 'SF', age: 32, height: 197, weight: 95, stars: 3.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 99, freeThrow: 83,
            playmaking: 68, ballHandling: 72, basketballIQ: 92, athleticism: 85,
            interiorDefense: 65, perimeterDefense: 92, stealing: 92, blocking: 45,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 72, passing: 68, inside: 65, outside: 99, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Dustin', lastName: 'Sleva', position: 'PF', age: 29, height: 203, weight: 102, stars: 3.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 78, threePointShot: 90, freeThrow: 75,
            playmaking: 65, ballHandling: 68, basketballIQ: 88, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 25,
            offensiveRebound: 75, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 65, inside: 65, outside: 90, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Edgaras', lastName: 'Ulanovas', position: 'SF', age: 33, height: 199, weight: 94, stars: 3.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 92, freeThrow: 81,
            playmaking: 75, ballHandling: 78, basketballIQ: 95, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 72, passing: 75, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Laurynas', lastName: 'Birutis', position: 'C', age: 27, height: 213, weight: 114, stars: 3.0, potential: 82,
          attributes: {
            finishing: 88, midRange: 25, threePointShot: 25, freeThrow: 41,
            playmaking: 52, ballHandling: 55, basketballIQ: 85, athleticism: 75,
            interiorDefense: 85, perimeterDefense: 35, stealing: 68, blocking: 82,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 65, passing: 45, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Ignas', lastName: 'Brazdeikis', position: 'SF', age: 26, height: 201, weight: 100, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 84, freeThrow: 77,
            playmaking: 68, ballHandling: 82, basketballIQ: 88, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 48
          },
          tendencies: { shooting: 82, passing: 68, inside: 75, outside: 84, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Kajus', lastName: 'Mikalauskas', position: 'PG', age: 19, height: 194, weight: 84, stars: 3.0, potential: 95,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 85, freeThrow: 100,
            playmaking: 99, ballHandling: 90, basketballIQ: 92, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 85, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 99, inside: 65, outside: 85, defensiveAggression: 99, foulTendency: 55 } },
        { firstName: 'Deividas', lastName: 'Sirvydis', position: 'SF', age: 24, height: 204, weight: 94, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 80, freeThrow: 93,
            playmaking: 68, ballHandling: 78, basketballIQ: 88, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 65, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 48
          },
          tendencies: { shooting: 78, passing: 68, inside: 65, outside: 80, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Dovydas', lastName: 'Giedraitis', position: 'SG', age: 24, height: 193, weight: 93, stars: 2.5, potential: 84,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 78, freeThrow: 50,
            playmaking: 75, ballHandling: 78, basketballIQ: 92, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 88, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 42
          },
          tendencies: { shooting: 65, passing: 75, inside: 55, outside: 78, defensiveAggression: 88, foulTendency: 50 } },
        { firstName: 'Mantas', lastName: 'Rubstavicius', position: 'SF', age: 22, height: 198, weight: 84, stars: 2.5, potential: 90,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 88, freeThrow: 100,
            playmaking: 62, ballHandling: 72, basketballIQ: 85, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 65, stealing: 68, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 48
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 88, defensiveAggression: 70, foulTendency: 50 } }
    ],
    // ─── VIRTUS BOLOGNA (VIR) ───────────────────────────────────────────────
    'VIR': [
        { firstName: 'Carsen', lastName: 'Edwards', position: 'SG', age: 27, height: 180, weight: 91, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 90, threePointShot: 85, freeThrow: 80,
            playmaking: 82, ballHandling: 92, basketballIQ: 92, athleticism: 95,
            interiorDefense: 35, perimeterDefense: 72, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 99, passing: 82, inside: 75, outside: 85, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Matt', lastName: 'Morgan', position: 'PG', age: 27, height: 188, weight: 79, stars: 4.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 88, freeThrow: 91,
            playmaking: 85, ballHandling: 88, basketballIQ: 90, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 88, passing: 85, inside: 65, outside: 88, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Luca', lastName: 'Vildoza', position: 'PG', age: 29, height: 191, weight: 86, stars: 4.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 83,
            playmaking: 92, ballHandling: 94, basketballIQ: 95, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 92, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 92, inside: 55, outside: 85, defensiveAggression: 92, foulTendency: 50 } },
        { firstName: 'Derrick', lastName: 'Alston Jr.', position: 'SF', age: 27, height: 206, weight: 86, stars: 4.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 94, freeThrow: 90,
            playmaking: 68, ballHandling: 82, basketballIQ: 90, athleticism: 88,
            interiorDefense: 55, perimeterDefense: 78, stealing: 72, blocking: 45,
            offensiveRebound: 45, defensiveRebound: 62
          },
          tendencies: { shooting: 82, passing: 68, inside: 65, outside: 94, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Alessandro', lastName: 'Pajola', position: 'PG', age: 25, height: 194, weight: 95, stars: 3.5, potential: 88,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 75, freeThrow: 67,
            playmaking: 90, ballHandling: 88, basketballIQ: 98, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 99, stealing: 95, blocking: 45,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 55, passing: 90, inside: 55, outside: 75, defensiveAggression: 99, foulTendency: 55 } },
        { firstName: 'Aliou', lastName: 'Diarra', position: 'C', age: 23, height: 213, weight: 104, stars: 3.5, potential: 92,
          attributes: {
            finishing: 88, midRange: 25, threePointShot: 25, freeThrow: 55,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 88,
            interiorDefense: 88, perimeterDefense: 35, stealing: 72, blocking: 99,
            offensiveRebound: 99, defensiveRebound: 95
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 95, foulTendency: 75 } },
        { firstName: 'Momo', lastName: 'Diouf', position: 'C', age: 23, height: 206, weight: 105, stars: 3.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 35, threePointShot: 25, freeThrow: 75,
            playmaking: 58, ballHandling: 62, basketballIQ: 88, athleticism: 90,
            interiorDefense: 85, perimeterDefense: 45, stealing: 78, blocking: 95,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 65, passing: 58, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 70 } },
        { firstName: 'Alen', lastName: 'Smailagic', position: 'PF', age: 24, height: 208, weight: 100, stars: 3.5, potential: 84,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 85, freeThrow: 76,
            playmaking: 62, ballHandling: 72, basketballIQ: 85, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 65, stealing: 78, blocking: 65,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 82, passing: 62, inside: 85, outside: 85, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Saliou', lastName: 'Niang', position: 'PF', age: 20, height: 204, weight: 98, stars: 3.0, potential: 92,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 75, freeThrow: 79,
            playmaking: 75, ballHandling: 78, basketballIQ: 88, athleticism: 92,
            interiorDefense: 82, perimeterDefense: 85, stealing: 92, blocking: 85,
            offensiveRebound: 88, defensiveRebound: 88
          },
          tendencies: { shooting: 72, passing: 75, inside: 82, outside: 75, defensiveAggression: 95, foulTendency: 65 } },
        { firstName: 'Karim', lastName: 'Jallow', position: 'SF', age: 28, height: 198, weight: 94, stars: 3.0, potential: 78,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 80, freeThrow: 60,
            playmaking: 62, ballHandling: 78, basketballIQ: 85, athleticism: 90,
            interiorDefense: 65, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 55, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 62, inside: 82, outside: 80, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Daniel', lastName: 'Hackett', position: 'PG', age: 37, height: 196, weight: 96, stars: 3.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 80, threePointShot: 85, freeThrow: 75,
            playmaking: 78, ballHandling: 82, basketballIQ: 99, athleticism: 75,
            interiorDefense: 45, perimeterDefense: 88, stealing: 85, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 65, passing: 78, inside: 65, outside: 85, defensiveAggression: 88, foulTendency: 55 } },
        { firstName: 'Nicola', lastName: 'Akele', position: 'PF', age: 29, height: 203, weight: 100, stars: 2.5, potential: 78,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 75, freeThrow: 50,
            playmaking: 68, ballHandling: 72, basketballIQ: 88, athleticism: 82,
            interiorDefense: 75, perimeterDefense: 72, stealing: 75, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 65, passing: 68, inside: 75, outside: 75, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Brandon', lastName: 'Taylor', position: 'PG', age: 31, height: 178, weight: 77, stars: 2.5, potential: 75,
          attributes: {
            finishing: 72, midRange: 82, threePointShot: 92, freeThrow: 100,
            playmaking: 85, ballHandling: 85, basketballIQ: 88, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 72, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 85, inside: 55, outside: 92, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Francesco', lastName: 'Ferrari', position: 'SF', age: 20, height: 201, weight: 90, stars: 2.5, potential: 88,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 68, freeThrow: 85,
            playmaking: 58, ballHandling: 72, basketballIQ: 82, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 65, stealing: 68, blocking: 65,
            offensiveRebound: 85, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 58, inside: 75, outside: 68, defensiveAggression: 75, foulTendency: 50 } }
    ],
    'DUB': [
        { firstName: 'Dwayne', lastName: 'Bacon', position: 'SF', age: 29, height: 201, weight: 100, stars: 5.0, potential: 92,
          attributes: {
            finishing: 90, midRange: 88, threePointShot: 82, freeThrow: 79,
            playmaking: 72, ballHandling: 88, basketballIQ: 88, athleticism: 92,
            interiorDefense: 62, perimeterDefense: 78, stealing: 72, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 95, passing: 65, inside: 82, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Dzanan', lastName: 'Musa', position: 'SF', age: 25, height: 205, weight: 101, stars: 4.5, potential: 90,
          attributes: {
            finishing: 88, midRange: 85, threePointShot: 85, freeThrow: 88,
            playmaking: 78, ballHandling: 85, basketballIQ: 92, athleticism: 85,
            interiorDefense: 55, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 88, passing: 78, inside: 75, outside: 88, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Mfiondu', lastName: 'Kabengele', position: 'C', age: 27, height: 208, weight: 113, stars: 4.5, potential: 88,
          attributes: {
            finishing: 92, midRange: 55, threePointShot: 75, freeThrow: 82,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 90,
            interiorDefense: 88, perimeterDefense: 45, stealing: 75, blocking: 88,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 52, inside: 95, outside: 75, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'McKinley', lastName: 'Wright IV', position: 'PG', age: 26, height: 180, weight: 87, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 88, freeThrow: 85,
            playmaking: 96, ballHandling: 92, basketballIQ: 94, athleticism: 88,
            interiorDefense: 45, perimeterDefense: 85, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 82, passing: 98, inside: 65, outside: 85, defensiveAggression: 85, foulTendency: 50 } },
        { firstName: 'Filip', lastName: 'Petrusev', position: 'PF', age: 24, height: 211, weight: 106, stars: 4.0, potential: 88,
          attributes: {
            finishing: 88, midRange: 82, threePointShot: 88, freeThrow: 81,
            playmaking: 68, ballHandling: 72, basketballIQ: 90, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 62, stealing: 72, blocking: 75,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 85, passing: 65, inside: 88, outside: 85, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Boogie', lastName: 'Ellis', position: 'SG', age: 24, height: 191, weight: 84, stars: 3.5, potential: 88,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 88, freeThrow: 81,
            playmaking: 72, ballHandling: 85, basketballIQ: 85, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 75, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 68, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Aleksa', lastName: 'Avramovic', position: 'PG', age: 30, height: 192, weight: 87, stars: 4.0, potential: 88,
          attributes: {
            finishing: 85, midRange: 75, threePointShot: 82, freeThrow: 78,
            playmaking: 85, ballHandling: 88, basketballIQ: 92, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 92, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 85, inside: 75, outside: 82, defensiveAggression: 98, foulTendency: 55 } },
        { firstName: 'Davis', lastName: 'Bertans', position: 'PF', age: 32, height: 208, weight: 102, stars: 3.5, potential: 84,
          attributes: {
            finishing: 75, midRange: 82, threePointShot: 95, freeThrow: 85,
            playmaking: 62, ballHandling: 68, basketballIQ: 90, athleticism: 78,
            interiorDefense: 55, perimeterDefense: 62, stealing: 62, blocking: 78,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 88, passing: 62, inside: 55, outside: 99, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Bruno', lastName: 'Caboclo', position: 'C', age: 29, height: 206, weight: 102, stars: 3.5, potential: 86,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 88, freeThrow: 69,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 92,
            interiorDefense: 88, perimeterDefense: 65, stealing: 65, blocking: 99,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 55, inside: 85, outside: 88, defensiveAggression: 95, foulTendency: 70 } },
        { firstName: 'Justin', lastName: 'Anderson', position: 'SF', age: 31, height: 198, weight: 104, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 88, freeThrow: 88,
            playmaking: 65, ballHandling: 75, basketballIQ: 85, athleticism: 85,
            interiorDefense: 65, perimeterDefense: 82, stealing: 78, blocking: 78,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 65, inside: 75, outside: 88, defensiveAggression: 80, foulTendency: 60 } },
        { firstName: 'Kenan', lastName: 'Kamenjas', position: 'C', age: 25, height: 207, weight: 105, stars: 3.0, potential: 86,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 68,
            playmaking: 55, ballHandling: 55, basketballIQ: 82, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 40, stealing: 72, blocking: 45,
            offensiveRebound: 95, defensiveRebound: 92
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Matt', lastName: 'Ryan', position: 'SF', age: 27, height: 201, weight: 98, stars: 2.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 78, threePointShot: 92, freeThrow: 85,
            playmaking: 58, ballHandling: 68, basketballIQ: 82, athleticism: 75,
            interiorDefense: 50, perimeterDefense: 65, stealing: 65, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 58, inside: 55, outside: 95, defensiveAggression: 65, foulTendency: 50 } },
        { firstName: 'Klemen', lastName: 'Prepelic', position: 'SG', age: 32, height: 191, weight: 90, stars: 3.0, potential: 80,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 82, freeThrow: 79,
            playmaking: 85, ballHandling: 85, basketballIQ: 92, athleticism: 78,
            interiorDefense: 40, perimeterDefense: 72, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 88, inside: 55, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Kosta', lastName: 'Kondic', position: 'SG', age: 23, height: 193, weight: 85, stars: 2.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 82, freeThrow: 88,
            playmaking: 75, ballHandling: 82, basketballIQ: 82, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 75, stealing: 88, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 75, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 55 } }
    ],
    'HTA': [
        { firstName: 'Elijah', lastName: 'Bryant', position: 'SF', age: 29, height: 196, weight: 95, stars: 5.0, potential: 92,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 88, freeThrow: 89,
            playmaking: 78, ballHandling: 85, basketballIQ: 92, athleticism: 88,
            interiorDefense: 62, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 68
          },
          tendencies: { shooting: 92, passing: 75, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Daniel', lastName: 'Oturu', position: 'C', age: 25, height: 208, weight: 109, stars: 5.0, potential: 92,
          attributes: {
            finishing: 94, midRange: 35, threePointShot: 25, freeThrow: 64,
            playmaking: 55, ballHandling: 58, basketballIQ: 90, athleticism: 92,
            interiorDefense: 92, perimeterDefense: 45, stealing: 68, blocking: 99,
            offensiveRebound: 88, defensiveRebound: 85
          },
          tendencies: { shooting: 82, passing: 45, inside: 98, outside: 25, defensiveAggression: 92, foulTendency: 70 } },
        { firstName: 'Antonio', lastName: 'Blakeney', position: 'SG', age: 28, height: 193, weight: 89, stars: 4.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 88, threePointShot: 90, freeThrow: 85,
            playmaking: 72, ballHandling: 92, basketballIQ: 88, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 35,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 95, passing: 65, inside: 65, outside: 95, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Vasilije', lastName: 'Micic', position: 'PG', age: 31, height: 196, weight: 91, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 88, threePointShot: 82, freeThrow: 90,
            playmaking: 94, ballHandling: 92, basketballIQ: 98, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 75, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 88, passing: 94, inside: 60, outside: 85, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Chris', lastName: 'Jones', position: 'PG', age: 31, height: 188, weight: 91, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 92, freeThrow: 88,
            playmaking: 96, ballHandling: 92, basketballIQ: 94, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 85, stealing: 88, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 96, inside: 60, outside: 92, defensiveAggression: 85, foulTendency: 45 } },
        { firstName: 'Johnathan', lastName: 'Motley', position: 'C', age: 29, height: 206, weight: 104, stars: 4.0, potential: 88,
          attributes: {
            finishing: 92, midRange: 65, threePointShot: 78, freeThrow: 73,
            playmaking: 65, ballHandling: 68, basketballIQ: 88, athleticism: 88,
            interiorDefense: 82, perimeterDefense: 50, stealing: 72, blocking: 65,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 85, passing: 65, inside: 92, outside: 65, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Collin', lastName: 'Malcolm', position: 'SF', age: 27, height: 201, weight: 91, stars: 3.5, potential: 86,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 92, freeThrow: 76,
            playmaking: 65, ballHandling: 78, basketballIQ: 85, athleticism: 84,
            interiorDefense: 65, perimeterDefense: 78, stealing: 75, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 68, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Ish', lastName: 'Wainright', position: 'PF', age: 30, height: 196, weight: 113, stars: 3.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 72, threePointShot: 75, freeThrow: 73,
            playmaking: 62, ballHandling: 72, basketballIQ: 92, athleticism: 92,
            interiorDefense: 85, perimeterDefense: 78, stealing: 82, blocking: 45,
            offensiveRebound: 72, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 75, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Kessler', lastName: 'Edwards', position: 'SF', age: 24, height: 203, weight: 92, stars: 3.5, potential: 88,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 94, freeThrow: 79,
            playmaking: 58, ballHandling: 72, basketballIQ: 85, athleticism: 88,
            interiorDefense: 65, perimeterDefense: 82, stealing: 72, blocking: 78,
            offensiveRebound: 65, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 55, inside: 65, outside: 94, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Bar', lastName: 'Timor', position: 'PG', age: 32, height: 190, weight: 84, stars: 3.0, potential: 80,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 95, freeThrow: 99,
            playmaking: 85, ballHandling: 82, basketballIQ: 92, athleticism: 82,
            interiorDefense: 40, perimeterDefense: 85, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 72, passing: 85, inside: 55, outside: 95, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Yam', lastName: 'Madar', position: 'PG', age: 23, height: 190, weight: 82, stars: 3.0, potential: 90,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 72, freeThrow: 84,
            playmaking: 88, ballHandling: 88, basketballIQ: 88, athleticism: 85,
            interiorDefense: 40, perimeterDefense: 78, stealing: 92, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 92, inside: 60, outside: 75, defensiveAggression: 88, foulTendency: 55 } },
        { firstName: 'Tyler', lastName: 'Ennis', position: 'PG', age: 30, height: 188, weight: 88, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 92, freeThrow: 80,
            playmaking: 82, ballHandling: 85, basketballIQ: 85, athleticism: 84,
            interiorDefense: 40, perimeterDefense: 72, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 82, inside: 65, outside: 92, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Tai', lastName: 'Odiase', position: 'C', age: 29, height: 206, weight: 109, stars: 3.0, potential: 82,
          attributes: {
            finishing: 88, midRange: 35, threePointShot: 25, freeThrow: 74,
            playmaking: 52, ballHandling: 55, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 40, stealing: 72, blocking: 85,
            offensiveRebound: 82, defensiveRebound: 85
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Tomer', lastName: 'Ginat', position: 'PF', age: 30, height: 202, weight: 100, stars: 2.5, potential: 78,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 65, freeThrow: 38,
            playmaking: 65, ballHandling: 72, basketballIQ: 92, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 82, blocking: 35,
            offensiveRebound: 65, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 72, inside: 75, outside: 65, defensiveAggression: 85, foulTendency: 60 } }
    ],
    'PAM': [
        { firstName: 'Jean', lastName: 'Montero', position: 'PG', age: 21, height: 188, weight: 81, stars: 5.0, potential: 95,
          attributes: {
            finishing: 88, midRange: 88, threePointShot: 85, freeThrow: 88,
            playmaking: 92, ballHandling: 94, basketballIQ: 92, athleticism: 95,
            interiorDefense: 35, perimeterDefense: 78, stealing: 82, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 95, passing: 88, inside: 75, outside: 85, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Kameron', lastName: 'Taylor', position: 'SG', age: 30, height: 198, weight: 95, stars: 4.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 85, threePointShot: 89, freeThrow: 82,
            playmaking: 72, ballHandling: 82, basketballIQ: 90, athleticism: 88,
            interiorDefense: 62, perimeterDefense: 85, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 82, passing: 72, inside: 75, outside: 89, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Brancou', lastName: 'Badio', position: 'SG', age: 26, height: 191, weight: 82, stars: 4.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 82, threePointShot: 84, freeThrow: 85,
            playmaking: 82, ballHandling: 88, basketballIQ: 88, athleticism: 90,
            interiorDefense: 45, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 88, passing: 82, inside: 75, outside: 84, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Nate', lastName: 'Reuvers', position: 'PF', age: 26, height: 211, weight: 107, stars: 4.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 92, freeThrow: 65,
            playmaking: 55, ballHandling: 62, basketballIQ: 88, athleticism: 82,
            interiorDefense: 82, perimeterDefense: 55, stealing: 72, blocking: 95,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 55, inside: 65, outside: 92, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Darius', lastName: 'Thompson', position: 'PG', age: 30, height: 193, weight: 89, stars: 4.0, potential: 86,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 91, freeThrow: 85,
            playmaking: 88, ballHandling: 90, basketballIQ: 92, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 92, stealing: 95, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 88, inside: 65, outside: 91, defensiveAggression: 95, foulTendency: 50 } },
        { firstName: 'Neal', lastName: 'Sako', position: 'C', age: 26, height: 211, weight: 102, stars: 4.0, potential: 88,
          attributes: {
            finishing: 88, midRange: 25, threePointShot: 25, freeThrow: 41,
            playmaking: 58, ballHandling: 52, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 35, stealing: 68, blocking: 92,
            offensiveRebound: 95, defensiveRebound: 92
          },
          tendencies: { shooting: 55, passing: 58, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 70 } },
        { firstName: 'Omari', lastName: 'Moore', position: 'PG', age: 24, height: 198, weight: 88, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 82, freeThrow: 73,
            playmaking: 85, ballHandling: 88, basketballIQ: 88, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 78, stealing: 75, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 85, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Jaime', lastName: 'Pradilla', position: 'PF', age: 24, height: 205, weight: 106, stars: 3.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 75, threePointShot: 85, freeThrow: 76,
            playmaking: 68, ballHandling: 68, basketballIQ: 92, athleticism: 82,
            interiorDefense: 82, perimeterDefense: 62, stealing: 72, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 68, inside: 85, outside: 85, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Matt', lastName: 'Costello', position: 'C', age: 31, height: 210, weight: 109, stars: 3.5, potential: 82,
          attributes: {
            finishing: 85, midRange: 78, threePointShot: 90, freeThrow: 49,
            playmaking: 58, ballHandling: 65, basketballIQ: 92, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 45, stealing: 72, blocking: 92,
            offensiveRebound: 78, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 58, inside: 82, outside: 90, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Braxton', lastName: 'Key', position: 'SF', age: 28, height: 203, weight: 104, stars: 3.5, potential: 84,
          attributes: {
            finishing: 82, midRange: 75, threePointShot: 73, freeThrow: 62,
            playmaking: 65, ballHandling: 72, basketballIQ: 90, athleticism: 88,
            interiorDefense: 82, perimeterDefense: 85, stealing: 85, blocking: 85,
            offensiveRebound: 65, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 73, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Sergio', lastName: 'De Larrea', position: 'PG', age: 19, height: 197, weight: 85, stars: 3.0, potential: 92,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 88, freeThrow: 71,
            playmaking: 90, ballHandling: 85, basketballIQ: 88, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 90, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Josep', lastName: 'Puerto', position: 'SF', age: 26, height: 199, weight: 92, stars: 3.0, potential: 84,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 90, freeThrow: 73,
            playmaking: 62, ballHandling: 78, basketballIQ: 88, athleticism: 82,
            interiorDefense: 55, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 90, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Isaac', lastName: 'Nogues', position: 'SG', age: 21, height: 194, weight: 86, stars: 2.5, potential: 90,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 25, freeThrow: 50,
            playmaking: 78, ballHandling: 82, basketballIQ: 88, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 85, stealing: 99, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 65
          },
          tendencies: { shooting: 55, passing: 78, inside: 65, outside: 25, defensiveAggression: 99, foulTendency: 65 } },
        { firstName: 'Nate', lastName: 'Sestina', position: 'PF', age: 28, height: 206, weight: 106, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 85, freeThrow: 80,
            playmaking: 75, ballHandling: 72, basketballIQ: 88, athleticism: 80,
            interiorDefense: 65, perimeterDefense: 62, stealing: 68, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 75, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 50 } }
    ],

    // ─── ARIS MIDEA THESSALONIKI (ARI) ──────────────────────────────────────
    'ARI': [
        { firstName: 'Bryce', lastName: 'Jones', position: 'PG', age: 31, height: 183, weight: 80, stars: 3.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 75, freeThrow: 92,
            playmaking: 84, ballHandling: 85, basketballIQ: 82, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 52
          },
          tendencies: { shooting: 88, passing: 88, inside: 85, outside: 65, defensiveAggression: 75, foulTendency: 99 } },
        { firstName: 'Danilo', lastName: 'Andjusic', position: 'SG', age: 33, height: 195, weight: 92, stars: 3.5, potential: 80,
          attributes: {
            finishing: 72, midRange: 82, threePointShot: 88, freeThrow: 82,
            playmaking: 75, ballHandling: 78, basketballIQ: 85, athleticism: 65,
            interiorDefense: 35, perimeterDefense: 62, stealing: 52, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 92, passing: 72, inside: 35, outside: 99, defensiveAggression: 55, foulTendency: 75 } },
        { firstName: 'Amine', lastName: 'Noua', position: 'PF', age: 27, height: 202, weight: 100, stars: 3.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 82, freeThrow: 80,
            playmaking: 62, ballHandling: 70, basketballIQ: 82, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 68, stealing: 68, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 78
          },
          tendencies: { shooting: 82, passing: 60, inside: 72, outside: 88, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Elijah', lastName: 'Long', position: 'PG', age: 27, height: 183, weight: 84, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 78,
            playmaking: 82, ballHandling: 82, basketballIQ: 78, athleticism: 85,
            interiorDefense: 42, perimeterDefense: 75, stealing: 82, blocking: 30,
            offensiveRebound: 32, defensiveRebound: 48
          },
          tendencies: { shooting: 80, passing: 85, inside: 75, outside: 72, defensiveAggression: 88, foulTendency: 55 } },
        { firstName: 'Arnoldas', lastName: 'Kulboka', position: 'SF', age: 27, height: 208, weight: 100, stars: 3.0, potential: 80,
          attributes: {
            finishing: 70, midRange: 78, threePointShot: 85, freeThrow: 70,
            playmaking: 60, ballHandling: 68, basketballIQ: 80, athleticism: 72,
            interiorDefense: 55, perimeterDefense: 62, stealing: 60, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 85, passing: 62, inside: 45, outside: 95, defensiveAggression: 55, foulTendency: 45 } },
        { firstName: 'Ronnie', lastName: 'Harrell', position: 'SF', age: 28, height: 201, weight: 91, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 70, freeThrow: 72,
            playmaking: 65, ballHandling: 72, basketballIQ: 78, athleticism: 85,
            interiorDefense: 65, perimeterDefense: 78, stealing: 85, blocking: 45,
            offensiveRebound: 52, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 70, defensiveAggression: 92, foulTendency: 55 } },
        { firstName: 'Jake', lastName: 'Forrester', position: 'C', age: 25, height: 206, weight: 102, stars: 2.5, potential: 78,
          attributes: {
            finishing: 80, midRange: 40, threePointShot: 25, freeThrow: 55,
            playmaking: 52, ballHandling: 55, basketballIQ: 75, athleticism: 84,
            interiorDefense: 78, perimeterDefense: 45, stealing: 55, blocking: 88,
            offensiveRebound: 85, defensiveRebound: 72
          },
          tendencies: { shooting: 62, passing: 52, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Kostas', lastName: 'Antetokounmpo', position: 'C', age: 27, height: 208, weight: 91, stars: 2.5, potential: 75,
          attributes: {
            finishing: 82, midRange: 35, threePointShot: 25, freeThrow: 50,
            playmaking: 55, ballHandling: 65, basketballIQ: 70, athleticism: 92,
            interiorDefense: 82, perimeterDefense: 65, stealing: 85, blocking: 88,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 55, passing: 55, inside: 95, outside: 25, defensiveAggression: 95, foulTendency: 75 } },
        { firstName: 'Steven', lastName: 'Enoch', position: 'C', age: 27, height: 208, weight: 116, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 65, threePointShot: 25, freeThrow: 72,
            playmaking: 52, ballHandling: 52, basketballIQ: 75, athleticism: 75,
            interiorDefense: 75, perimeterDefense: 42, stealing: 55, blocking: 72,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 65, passing: 50, inside: 90, outside: 25, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Lefteris', lastName: 'Bochoridis', position: 'G', age: 30, height: 196, weight: 91, stars: 2.0, potential: 72,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 75,
            playmaking: 75, ballHandling: 75, basketballIQ: 85, athleticism: 72,
            interiorDefense: 45, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 52
          },
          tendencies: { shooting: 68, passing: 80, inside: 55, outside: 78, defensiveAggression: 75, foulTendency: 60 } },
        { firstName: 'Panagiotis', lastName: 'Lefas', position: 'G', age: 19, height: 190, weight: 85, stars: 1.5, potential: 88,
          attributes: {
            finishing: 70, midRange: 75, threePointShot: 85, freeThrow: 50,
            playmaking: 78, ballHandling: 78, basketballIQ: 75, athleticism: 80,
            interiorDefense: 35, perimeterDefense: 65, stealing: 60, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 85, passing: 78, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Bryn', lastName: 'Forbes', position: 'SG', age: 31, height: 188, weight: 79, stars: 2.0, potential: 72,
          attributes: {
            finishing: 65, midRange: 75, threePointShot: 72, freeThrow: 78,
            playmaking: 62, ballHandling: 72, basketballIQ: 82, athleticism: 72,
            interiorDefense: 32, perimeterDefense: 62, stealing: 55, blocking: 20,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 88, passing: 62, inside: 45, outside: 92, defensiveAggression: 50, foulTendency: 35 } },
        { firstName: 'Stelios', lastName: 'Poulianitis', position: 'PG', age: 29, height: 190, weight: 88, stars: 1.5, potential: 70,
          attributes: {
            finishing: 68, midRange: 70, threePointShot: 70, freeThrow: 68,
            playmaking: 72, ballHandling: 72, basketballIQ: 82, athleticism: 72,
            interiorDefense: 40, perimeterDefense: 75, stealing: 65, blocking: 20,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 65, passing: 75, inside: 55, outside: 72, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Alex', lastName: 'Merkviladze', position: 'PF', age: 23, height: 206, weight: 104, stars: 1.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 68, threePointShot: 25, freeThrow: 75,
            playmaking: 55, ballHandling: 62, basketballIQ: 72, athleticism: 75,
            interiorDefense: 68, perimeterDefense: 55, stealing: 55, blocking: 40,
            offensiveRebound: 62, defensiveRebound: 75
          },
          tendencies: { shooting: 65, passing: 55, inside: 85, outside: 25, defensiveAggression: 70, foulTendency: 65 } },
        { firstName: 'Giorgos', lastName: 'Gkiouzelis', position: 'PF', age: 29, height: 204, weight: 100, stars: 1.0, potential: 68,
          attributes: {
            finishing: 70, midRange: 65, threePointShot: 75, freeThrow: 50,
            playmaking: 52, ballHandling: 58, basketballIQ: 75, athleticism: 72,
            interiorDefense: 65, perimeterDefense: 62, stealing: 62, blocking: 35,
            offensiveRebound: 42, defensiveRebound: 65
          },
          tendencies: { shooting: 62, passing: 55, inside: 65, outside: 82, defensiveAggression: 70, foulTendency: 55 } }
    ],
    // ─── BAHCESEHIR KOLEJI ISTANBUL (BAH) ───────────────────────────────────
    'BAH': [
        { firstName: 'Malachi', lastName: 'Flynn', position: 'PG', age: 27, height: 185, weight: 84, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 80, freeThrow: 78,
            playmaking: 85, ballHandling: 88, basketballIQ: 85, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 78, stealing: 85, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 55
          },
          tendencies: { shooting: 92, passing: 85, inside: 65, outside: 92, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Trevion', lastName: 'Williams', position: 'C', age: 24, height: 206, weight: 120, stars: 3.5, potential: 90,
          attributes: {
            finishing: 82, midRange: 60, threePointShot: 25, freeThrow: 60,
            playmaking: 82, ballHandling: 72, basketballIQ: 92, athleticism: 75,
            interiorDefense: 78, perimeterDefense: 45, stealing: 78, blocking: 65,
            offensiveRebound: 92, defensiveRebound: 95
          },
          tendencies: { shooting: 78, passing: 95, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 75 } },
        { firstName: 'Tyler', lastName: 'Cavanaugh', position: 'PF', age: 31, height: 206, weight: 108, stars: 3.0, potential: 80,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 82, freeThrow: 88,
            playmaking: 55, ballHandling: 65, basketballIQ: 82, athleticism: 68,
            interiorDefense: 65, perimeterDefense: 60, stealing: 62, blocking: 40,
            offensiveRebound: 62, defensiveRebound: 75
          },
          tendencies: { shooting: 82, passing: 55, inside: 65, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Caleb', lastName: 'Homesley', position: 'SG', age: 29, height: 198, weight: 93, stars: 3.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 72,
            playmaking: 72, ballHandling: 80, basketballIQ: 75, athleticism: 80,
            interiorDefense: 40, perimeterDefense: 72, stealing: 65, blocking: 42,
            offensiveRebound: 32, defensiveRebound: 52
          },
          tendencies: { shooting: 88, passing: 78, inside: 75, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Hunter', lastName: 'Hale', position: 'SG', age: 28, height: 191, weight: 84, stars: 2.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 82,
            playmaking: 75, ballHandling: 80, basketballIQ: 80, athleticism: 75,
            interiorDefense: 35, perimeterDefense: 70, stealing: 75, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 85, passing: 82, inside: 65, outside: 88, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Mateusz', lastName: 'Ponitka', position: 'SF', age: 31, height: 198, weight: 93, stars: 3.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 60, freeThrow: 76,
            playmaking: 75, ballHandling: 75, basketballIQ: 92, athleticism: 75,
            interiorDefense: 70, perimeterDefense: 82, stealing: 82, blocking: 32,
            offensiveRebound: 62, defensiveRebound: 75
          },
          tendencies: { shooting: 65, passing: 85, inside: 75, outside: 65, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Balsa', lastName: 'Koprivica', position: 'C', age: 25, height: 216, weight: 109, stars: 2.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 32, threePointShot: 25, freeThrow: 60,
            playmaking: 52, ballHandling: 52, basketballIQ: 70, athleticism: 82,
            interiorDefense: 80, perimeterDefense: 42, stealing: 50, blocking: 92,
            offensiveRebound: 80, defensiveRebound: 80
          },
          tendencies: { shooting: 60, passing: 55, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 75 } },
        { firstName: 'Matt', lastName: 'Mitchell', position: 'PF', age: 26, height: 198, weight: 107, stars: 2.5, potential: 80,
          attributes: {
            finishing: 75, midRange: 70, threePointShot: 68, freeThrow: 72,
            playmaking: 60, ballHandling: 70, basketballIQ: 75, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 72, stealing: 80, blocking: 32,
            offensiveRebound: 60, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 65, inside: 82, outside: 72, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Kenan', lastName: 'Sipahi', position: 'PG', age: 30, height: 197, weight: 88, stars: 2.5, potential: 72,
          attributes: {
            finishing: 70, midRange: 72, threePointShot: 82, freeThrow: 85,
            playmaking: 82, ballHandling: 80, basketballIQ: 85, athleticism: 72,
            interiorDefense: 42, perimeterDefense: 75, stealing: 70, blocking: 25,
            offensiveRebound: 38, defensiveRebound: 50
          },
          tendencies: { shooting: 65, passing: 92, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Jordan', lastName: 'Ford', position: 'PG', age: 27, height: 185, weight: 79, stars: 2.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 80, threePointShot: 68, freeThrow: 95,
            playmaking: 75, ballHandling: 82, basketballIQ: 80, athleticism: 82,
            interiorDefense: 30, perimeterDefense: 62, stealing: 70, blocking: 20,
            offensiveRebound: 22, defensiveRebound: 32
          },
          tendencies: { shooting: 82, passing: 78, inside: 65, outside: 75, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Ismet', lastName: 'Akpinar', position: 'G', age: 30, height: 191, weight: 77, stars: 2.0, potential: 72,
          attributes: {
            finishing: 68, midRange: 72, threePointShot: 75, freeThrow: 85,
            playmaking: 62, ballHandling: 72, basketballIQ: 80, athleticism: 75,
            interiorDefense: 32, perimeterDefense: 65, stealing: 58, blocking: 20,
            offensiveRebound: 22, defensiveRebound: 30
          },
          tendencies: { shooting: 78, passing: 65, inside: 55, outside: 82, defensiveAggression: 60, foulTendency: 45 } },
        { firstName: 'Goktug', lastName: 'Bas', position: 'PF', age: 29, height: 203, weight: 100, stars: 1.5, potential: 68,
          attributes: {
            finishing: 72, midRange: 62, threePointShot: 58, freeThrow: 50,
            playmaking: 60, ballHandling: 62, basketballIQ: 72, athleticism: 80,
            interiorDefense: 70, perimeterDefense: 60, stealing: 88, blocking: 42,
            offensiveRebound: 82, defensiveRebound: 70
          },
          tendencies: { shooting: 62, passing: 62, inside: 85, outside: 55, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Furkan', lastName: 'Haltali', position: 'C', age: 22, height: 211, weight: 105, stars: 2.0, potential: 82,
          attributes: {
            finishing: 80, midRange: 42, threePointShot: 25, freeThrow: 55,
            playmaking: 65, ballHandling: 52, basketballIQ: 75, athleticism: 75,
            interiorDefense: 75, perimeterDefense: 42, stealing: 50, blocking: 82,
            offensiveRebound: 80, defensiveRebound: 75
          },
          tendencies: { shooting: 65, passing: 72, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 70 } }
    ],
    'MAN': [
        { firstName: 'Hugo', lastName: 'Benitez', position: 'PG', age: 24, height: 191, weight: 84, stars: 3.5, potential: 88,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 72, freeThrow: 88,
            playmaking: 85, ballHandling: 84, basketballIQ: 88, athleticism: 78,
            interiorDefense: 40, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 72, passing: 99, inside: 55, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Alfonso', lastName: 'Plummer', position: 'SG', age: 27, height: 185, weight: 82, stars: 3.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 80, threePointShot: 88, freeThrow: 85,
            playmaking: 65, ballHandling: 78, basketballIQ: 80, athleticism: 75,
            interiorDefense: 32, perimeterDefense: 62, stealing: 52, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 95, passing: 62, inside: 45, outside: 99, defensiveAggression: 50, foulTendency: 45 } },
        { firstName: 'Retin', lastName: 'Obasohan', position: 'G', age: 31, height: 188, weight: 95, stars: 3.0, potential: 78,
          attributes: {
            finishing: 82, midRange: 70, threePointShot: 68, freeThrow: 70,
            playmaking: 78, ballHandling: 82, basketballIQ: 82, athleticism: 90,
            interiorDefense: 50, perimeterDefense: 85, stealing: 78, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 78, inside: 88, outside: 65, defensiveAggression: 88, foulTendency: 75 } },
        { firstName: 'Louis', lastName: 'Olinde', position: 'SF', age: 27, height: 205, weight: 87, stars: 3.0, potential: 80,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 78, freeThrow: 80,
            playmaking: 62, ballHandling: 70, basketballIQ: 85, athleticism: 85,
            interiorDefense: 68, perimeterDefense: 78, stealing: 62, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 65, inside: 72, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Pierre', lastName: 'Oriola', position: 'PF', age: 32, height: 206, weight: 107, stars: 3.0, potential: 72,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 70, freeThrow: 90,
            playmaking: 70, ballHandling: 65, basketballIQ: 95, athleticism: 65,
            interiorDefense: 78, perimeterDefense: 65, stealing: 68, blocking: 45,
            offensiveRebound: 82, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 78, inside: 85, outside: 68, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Eli', lastName: 'Brooks', position: 'G', age: 26, height: 185, weight: 84, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 82, freeThrow: 85,
            playmaking: 78, ballHandling: 82, basketballIQ: 82, athleticism: 80,
            interiorDefense: 40, perimeterDefense: 75, stealing: 78, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 80, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Hugo', lastName: 'Benitez', position: 'PG', age: 24, height: 191, weight: 84, stars: 3.0, potential: 85,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 70, freeThrow: 88,
            playmaking: 85, ballHandling: 82, basketballIQ: 85, athleticism: 75,
            interiorDefense: 38, perimeterDefense: 75, stealing: 78, blocking: 20,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 68, passing: 95, inside: 55, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Grant', lastName: 'Golden', position: 'C', age: 27, height: 208, weight: 116, stars: 3.0, potential: 80,
          attributes: {
            finishing: 80, midRange: 68, threePointShot: 25, freeThrow: 70,
            playmaking: 82, ballHandling: 72, basketballIQ: 88, athleticism: 72,
            interiorDefense: 78, perimeterDefense: 45, stealing: 62, blocking: 65,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 88, inside: 92, outside: 25, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Augustin', lastName: 'Ubal', position: 'SF', age: 21, height: 198, weight: 88, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 76, threePointShot: 75, freeThrow: 85,
            playmaking: 68, ballHandling: 75, basketballIQ: 82, athleticism: 82,
            interiorDefense: 62, perimeterDefense: 78, stealing: 72, blocking: 35,
            offensiveRebound: 55, defensiveRebound: 68
          },
          tendencies: { shooting: 80, passing: 68, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Kaodirichi', lastName: 'Akobundu-Ehiogu', position: 'C', age: 25, height: 208, weight: 104, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 30, threePointShot: 25, freeThrow: 75,
            playmaking: 45, ballHandling: 52, basketballIQ: 70, athleticism: 95,
            interiorDefense: 85, perimeterDefense: 45, stealing: 55, blocking: 99,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 55, passing: 45, inside: 95, outside: 25, defensiveAggression: 92, foulTendency: 75 } },
        { firstName: 'Ferran', lastName: 'Bassas', position: 'PG', age: 32, height: 181, weight: 70, stars: 2.5, potential: 72,
          attributes: {
            finishing: 70, midRange: 75, threePointShot: 78, freeThrow: 99,
            playmaking: 85, ballHandling: 82, basketballIQ: 92, athleticism: 70,
            interiorDefense: 35, perimeterDefense: 72, stealing: 65, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 75, passing: 95, inside: 45, outside: 85, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Alex', lastName: 'Reyes', position: 'SF', age: 31, height: 202, weight: 95, stars: 2.5, potential: 72,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 80, freeThrow: 85,
            playmaking: 60, ballHandling: 68, basketballIQ: 78, athleticism: 75,
            interiorDefense: 62, perimeterDefense: 68, stealing: 65, blocking: 35,
            offensiveRebound: 40, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 62, inside: 55, outside: 88, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Dani', lastName: 'Perez', position: 'PG', age: 34, height: 188, weight: 80, stars: 2.5, potential: 70,
          attributes: {
            finishing: 68, midRange: 72, threePointShot: 72, freeThrow: 70,
            playmaking: 88, ballHandling: 82, basketballIQ: 95, athleticism: 65,
            interiorDefense: 35, perimeterDefense: 70, stealing: 72, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 65, passing: 99, inside: 45, outside: 78, defensiveAggression: 65, foulTendency: 55 } },
        { firstName: 'Marcis', lastName: 'Steinbergs', position: 'PF', age: 23, height: 208, weight: 100, stars: 2.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 70, freeThrow: 70,
            playmaking: 55, ballHandling: 62, basketballIQ: 75, athleticism: 78,
            interiorDefense: 70, perimeterDefense: 62, stealing: 55, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 55, inside: 75, outside: 75, defensiveAggression: 70, foulTendency: 65 } }
    ],
    'BES': [
        { firstName: 'Ante', lastName: 'Zizic', position: 'C', age: 28, height: 211, weight: 121, stars: 3.5, potential: 88,
          attributes: {
            finishing: 85, midRange: 60, threePointShot: 25, freeThrow: 72,
            playmaking: 55, ballHandling: 58, basketballIQ: 92, athleticism: 75,
            interiorDefense: 82, perimeterDefense: 45, stealing: 55, blocking: 78,
            offensiveRebound: 88, defensiveRebound: 88
          },
          tendencies: { shooting: 88, passing: 55, inside: 95, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Jonah', lastName: 'Mathews', position: 'SG', age: 27, height: 191, weight: 93, stars: 3.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 78, freeThrow: 74,
            playmaking: 78, ballHandling: 82, basketballIQ: 82, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 92, passing: 78, inside: 65, outside: 92, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Anthony', lastName: 'Brown', position: 'SF', age: 32, height: 201, weight: 102, stars: 3.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 85,
            playmaking: 68, ballHandling: 72, basketballIQ: 85, athleticism: 75,
            interiorDefense: 65, perimeterDefense: 78, stealing: 72, blocking: 35,
            offensiveRebound: 40, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 72, inside: 55, outside: 92, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Devon', lastName: 'Dotson', position: 'PG', age: 25, height: 188, weight: 84, stars: 3.0, potential: 84,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 72, freeThrow: 70,
            playmaking: 82, ballHandling: 85, basketballIQ: 80, athleticism: 88,
            interiorDefense: 40, perimeterDefense: 78, stealing: 72, blocking: 20,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 88, inside: 75, outside: 65, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Ismael', lastName: 'Kamagate', position: 'C', age: 24, height: 211, weight: 100, stars: 3.0, potential: 88,
          attributes: {
            finishing: 82, midRange: 35, threePointShot: 25, freeThrow: 65,
            playmaking: 52, ballHandling: 55, basketballIQ: 78, athleticism: 85,
            interiorDefense: 80, perimeterDefense: 45, stealing: 55, blocking: 92,
            offensiveRebound: 82, defensiveRebound: 82
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 75 } },
        { firstName: 'Conor', lastName: 'Morgan', position: 'PF', age: 30, height: 206, weight: 102, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 82,
            playmaking: 72, ballHandling: 70, basketballIQ: 82, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 62, stealing: 55, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 68
          },
          tendencies: { shooting: 82, passing: 75, inside: 65, outside: 92, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Vitto', lastName: 'Brown', position: 'PF', age: 29, height: 203, weight: 107, stars: 2.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 85, freeThrow: 72,
            playmaking: 60, ballHandling: 68, basketballIQ: 82, athleticism: 78,
            interiorDefense: 68, perimeterDefense: 68, stealing: 68, blocking: 35,
            offensiveRebound: 52, defensiveRebound: 65
          },
          tendencies: { shooting: 80, passing: 65, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Berk', lastName: 'Ugurlu', position: 'PG', age: 29, height: 191, weight: 80, stars: 2.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 75, freeThrow: 88,
            playmaking: 82, ballHandling: 82, basketballIQ: 88, athleticism: 75,
            interiorDefense: 40, perimeterDefense: 75, stealing: 72, blocking: 15,
            offensiveRebound: 32, defensiveRebound: 42
          },
          tendencies: { shooting: 65, passing: 92, inside: 65, outside: 75, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Brynton', lastName: 'Lemar', position: 'G', age: 30, height: 193, weight: 88, stars: 2.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 78, freeThrow: 78,
            playmaking: 75, ballHandling: 78, basketballIQ: 80, athleticism: 80,
            interiorDefense: 35, perimeterDefense: 68, stealing: 72, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 80, inside: 65, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Yigit', lastName: 'Arslan', position: 'SG', age: 28, height: 193, weight: 88, stars: 2.0, potential: 72,
          attributes: {
            finishing: 70, midRange: 72, threePointShot: 78, freeThrow: 88,
            playmaking: 65, ballHandling: 72, basketballIQ: 78, athleticism: 72,
            interiorDefense: 32, perimeterDefense: 70, stealing: 75, blocking: 20,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 78, passing: 65, inside: 55, outside: 85, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Sertac', lastName: 'Sanli', position: 'C', age: 33, height: 213, weight: 115, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 50, freeThrow: 99,
            playmaking: 55, ballHandling: 52, basketballIQ: 95, athleticism: 55,
            interiorDefense: 80, perimeterDefense: 40, stealing: 25, blocking: 85,
            offensiveRebound: 35, defensiveRebound: 85
          },
          tendencies: { shooting: 65, passing: 55, inside: 85, outside: 55, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Matt', lastName: 'Thomas', position: 'SG', age: 30, height: 193, weight: 89, stars: 2.0, potential: 72,
          attributes: {
            finishing: 65, midRange: 75, threePointShot: 75, freeThrow: 68,
            playmaking: 68, ballHandling: 72, basketballIQ: 82, athleticism: 70,
            interiorDefense: 30, perimeterDefense: 62, stealing: 55, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 85, passing: 72, inside: 45, outside: 88, defensiveAggression: 55, foulTendency: 35 } }
    ],
    'BUD': [
        { firstName: 'Yogi', lastName: 'Ferrell', position: 'PG', age: 31, height: 183, weight: 81, stars: 3.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 85, freeThrow: 90,
            playmaking: 84, ballHandling: 85, basketballIQ: 88, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 45
          },
          tendencies: { shooting: 88, passing: 85, inside: 55, outside: 92, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Skylar', lastName: 'Mays', position: 'G', age: 27, height: 191, weight: 93, stars: 3.5, potential: 88,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 82, freeThrow: 88,
            playmaking: 78, ballHandling: 82, basketballIQ: 82, athleticism: 85,
            interiorDefense: 45, perimeterDefense: 85, stealing: 92, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 85, passing: 78, inside: 75, outside: 82, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Axel', lastName: 'Bouteille', position: 'SF', age: 29, height: 201, weight: 95, stars: 3.0, potential: 80,
          attributes: {
            finishing: 75, midRange: 80, threePointShot: 88, freeThrow: 88,
            playmaking: 65, ballHandling: 72, basketballIQ: 85, athleticism: 75,
            interiorDefense: 60, perimeterDefense: 68, stealing: 65, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 82, passing: 60, inside: 55, outside: 99, defensiveAggression: 60, foulTendency: 45 } },
        { firstName: 'Rasheed', lastName: 'Sulaimon', position: 'G', age: 31, height: 193, weight: 88, stars: 3.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 78, freeThrow: 65,
            playmaking: 78, ballHandling: 82, basketballIQ: 80, athleticism: 80,
            interiorDefense: 40, perimeterDefense: 72, stealing: 72, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 82, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Juwan', lastName: 'Morgan', position: 'PF', age: 28, height: 201, weight: 105, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 75, freeThrow: 76,
            playmaking: 68, ballHandling: 70, basketballIQ: 82, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 82, stealing: 92, blocking: 85,
            offensiveRebound: 65, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 68, inside: 75, outside: 72, defensiveAggression: 95, foulTendency: 65 } },
        { firstName: 'Nikola', lastName: 'Tanaskovic', position: 'PF', age: 27, height: 204, weight: 102, stars: 3.0, potential: 82,
          attributes: {
            finishing: 80, midRange: 70, threePointShot: 60, freeThrow: 61,
            playmaking: 60, ballHandling: 65, basketballIQ: 82, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 65, stealing: 68, blocking: 45,
            offensiveRebound: 85, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 62, inside: 85, outside: 55, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Fletcher', lastName: 'Magee', position: 'SG', age: 28, height: 193, weight: 91, stars: 2.5, potential: 78,
          attributes: {
            finishing: 65, midRange: 78, threePointShot: 85, freeThrow: 99,
            playmaking: 60, ballHandling: 72, basketballIQ: 82, athleticism: 70,
            interiorDefense: 30, perimeterDefense: 62, stealing: 52, blocking: 15,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 88, passing: 60, inside: 45, outside: 99, defensiveAggression: 50, foulTendency: 35 } },
        { firstName: 'Jerry', lastName: 'Boutsiele', position: 'C', age: 33, height: 207, weight: 115, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 45, threePointShot: 25, freeThrow: 68,
            playmaking: 55, ballHandling: 52, basketballIQ: 78, athleticism: 75,
            interiorDefense: 80, perimeterDefense: 42, stealing: 55, blocking: 88,
            offensiveRebound: 82, defensiveRebound: 78
          },
          tendencies: { shooting: 65, passing: 55, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 75 } },
        { firstName: 'Alexander', lastName: 'Kovliyar', position: 'PG', age: 22, height: 191, weight: 80, stars: 2.0, potential: 82,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 75, freeThrow: 69,
            playmaking: 75, ballHandling: 78, basketballIQ: 75, athleticism: 80,
            interiorDefense: 35, perimeterDefense: 72, stealing: 78, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 72, passing: 82, inside: 65, outside: 78, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'James', lastName: 'Thompson IV', position: 'C', age: 30, height: 208, weight: 109, stars: 2.0, potential: 72,
          attributes: {
            finishing: 78, midRange: 40, threePointShot: 25, freeThrow: 46,
            playmaking: 48, ballHandling: 48, basketballIQ: 75, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 40, stealing: 55, blocking: 72,
            offensiveRebound: 85, defensiveRebound: 78
          },
          tendencies: { shooting: 62, passing: 45, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 70 } },
        { firstName: 'Djordje', lastName: 'Jovanovic', position: 'SF', age: 22, height: 199, weight: 92, stars: 1.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 65, freeThrow: 99,
            playmaking: 55, ballHandling: 68, basketballIQ: 72, athleticism: 78,
            interiorDefense: 62, perimeterDefense: 65, stealing: 60, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 55
          },
          tendencies: { shooting: 72, passing: 62, inside: 75, outside: 70, defensiveAggression: 70, foulTendency: 55 } }
    ],
    'CED': [
        { firstName: 'Umoja', lastName: 'Gibson', position: 'PG', age: 26, height: 185, weight: 77, stars: 3.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 82, freeThrow: 88,
            playmaking: 82, ballHandling: 85, basketballIQ: 85, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 72, stealing: 78, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 95, passing: 85, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Aleksej', lastName: 'Nikolic', position: 'PG', age: 30, height: 191, weight: 92, stars: 3.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 80, freeThrow: 90,
            playmaking: 82, ballHandling: 80, basketballIQ: 92, athleticism: 75,
            interiorDefense: 38, perimeterDefense: 78, stealing: 72, blocking: 15,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 92, inside: 55, outside: 82, defensiveAggression: 80, foulTendency: 45 } },
        { firstName: 'D.J.', lastName: 'Stewart', position: 'SG', age: 25, height: 198, weight: 93, stars: 3.0, potential: 85,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 82, freeThrow: 75,
            playmaking: 65, ballHandling: 80, basketballIQ: 78, athleticism: 85,
            interiorDefense: 42, perimeterDefense: 75, stealing: 75, blocking: 32,
            offensiveRebound: 32, defensiveRebound: 52
          },
          tendencies: { shooting: 88, passing: 62, inside: 75, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Matthew', lastName: 'Hurt', position: 'PF', age: 25, height: 206, weight: 106, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 78, freeThrow: 99,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 60, stealing: 62, blocking: 88,
            offensiveRebound: 55, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 55, inside: 68, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'David', lastName: 'Skara', position: 'SF', age: 30, height: 203, weight: 104, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 65, freeThrow: 78,
            playmaking: 52, ballHandling: 65, basketballIQ: 82, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 72, stealing: 60, blocking: 35,
            offensiveRebound: 65, defensiveRebound: 68
          },
          tendencies: { shooting: 72, passing: 55, inside: 75, outside: 65, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Thomas', lastName: 'Kennedy', position: 'C', age: 25, height: 206, weight: 104, stars: 2.5, potential: 82,
          attributes: {
            finishing: 80, midRange: 35, threePointShot: 25, freeThrow: 48,
            playmaking: 62, ballHandling: 58, basketballIQ: 75, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 45, stealing: 55, blocking: 52,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 68, inside: 92, outside: 25, defensiveAggression: 75, foulTendency: 75 } },
        { firstName: 'Luka', lastName: 'Brajkovic', position: 'C', age: 25, height: 208, weight: 110, stars: 2.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 30, threePointShot: 25, freeThrow: 50,
            playmaking: 48, ballHandling: 48, basketballIQ: 75, athleticism: 72,
            interiorDefense: 80, perimeterDefense: 40, stealing: 52, blocking: 85,
            offensiveRebound: 85, defensiveRebound: 85
          },
          tendencies: { shooting: 60, passing: 52, inside: 95, outside: 25, defensiveAggression: 85, foulTendency: 75 } },
        { firstName: 'Jaka', lastName: 'Blazic', position: 'SG', age: 35, height: 196, weight: 96, stars: 2.5, potential: 70,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 70,
            playmaking: 68, ballHandling: 72, basketballIQ: 95, athleticism: 65,
            interiorDefense: 42, perimeterDefense: 75, stealing: 68, blocking: 10,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 72, passing: 78, inside: 65, outside: 82, defensiveAggression: 85, foulTendency: 55 } },
        { firstName: 'Joseph', lastName: 'Girard III', position: 'G', age: 25, height: 185, weight: 86, stars: 2.0, potential: 82,
          attributes: {
            finishing: 65, midRange: 75, threePointShot: 82, freeThrow: 93,
            playmaking: 65, ballHandling: 75, basketballIQ: 82, athleticism: 75,
            interiorDefense: 30, perimeterDefense: 62, stealing: 72, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 32
          },
          tendencies: { shooting: 85, passing: 72, inside: 45, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Nikos', lastName: 'Chougkaz', position: 'PF', age: 25, height: 208, weight: 100, stars: 2.0, potential: 82,
          attributes: {
            finishing: 72, midRange: 68, threePointShot: 65, freeThrow: 83,
            playmaking: 55, ballHandling: 62, basketballIQ: 72, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 55, inside: 75, outside: 65, defensiveAggression: 80, foulTendency: 65 } }
    ], 'JLB': [
        { firstName: 'Darius', lastName: 'McGhee', position: 'PG', age: 25, height: 175, weight: 73, stars: 3.0, potential: 85,
          attributes: {
            finishing: 78, midRange: 78, threePointShot: 80, freeThrow: 82,
            playmaking: 82, ballHandling: 85, basketballIQ: 82, athleticism: 88,
            interiorDefense: 30, perimeterDefense: 72, stealing: 78, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 92, passing: 85, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Adam', lastName: 'Mokoka', position: 'G', age: 26, height: 196, weight: 86, stars: 3.0, potential: 82,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 72, freeThrow: 74,
            playmaking: 75, ballHandling: 78, basketballIQ: 82, athleticism: 85,
            interiorDefense: 50, perimeterDefense: 85, stealing: 78, blocking: 35,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 72, inside: 75, outside: 75, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Both', lastName: 'Gach', position: 'SF', age: 26, height: 201, weight: 84, stars: 2.5, potential: 80,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 82, freeThrow: 78,
            playmaking: 65, ballHandling: 72, basketballIQ: 80, athleticism: 82,
            interiorDefense: 62, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 65, inside: 62, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Kevin', lastName: 'Kokila', position: 'C', age: 23, height: 204, weight: 100, stars: 2.5, potential: 85,
          attributes: {
            finishing: 80, midRange: 32, threePointShot: 25, freeThrow: 78,
            playmaking: 52, ballHandling: 52, basketballIQ: 78, athleticism: 82,
            interiorDefense: 78, perimeterDefense: 50, stealing: 65, blocking: 82,
            offensiveRebound: 85, defensiveRebound: 75
          },
          tendencies: { shooting: 65, passing: 55, inside: 92, outside: 25, defensiveAggression: 82, foulTendency: 75 } },
        { firstName: 'Ricky', lastName: 'Lindo', position: 'PF', age: 24, height: 203, weight: 95, stars: 2.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 50, freeThrow: 65,
            playmaking: 60, ballHandling: 65, basketballIQ: 82, athleticism: 85,
            interiorDefense: 75, perimeterDefense: 78, stealing: 85, blocking: 85,
            offensiveRebound: 72, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 62, inside: 82, outside: 55, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'William', lastName: 'McDowell-White', position: 'PG', age: 27, height: 196, weight: 89, stars: 2.5, potential: 80,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 75, freeThrow: 67,
            playmaking: 82, ballHandling: 82, basketballIQ: 85, athleticism: 75,
            interiorDefense: 40, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 68, passing: 92, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Tre', lastName: 'Mitchell', position: 'PF', age: 24, height: 206, weight: 104, stars: 2.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 68, freeThrow: 75,
            playmaking: 62, ballHandling: 65, basketballIQ: 80, athleticism: 72,
            interiorDefense: 72, perimeterDefense: 62, stealing: 62, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 72
          },
          tendencies: { shooting: 75, passing: 68, inside: 75, outside: 72, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Tajuan', lastName: 'Agee', position: 'PF', age: 27, height: 206, weight: 102, stars: 2.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 68, threePointShot: 60, freeThrow: 65,
            playmaking: 68, ballHandling: 65, basketballIQ: 78, athleticism: 80,
            interiorDefense: 70, perimeterDefense: 55, stealing: 55, blocking: 52,
            offensiveRebound: 78, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 78, inside: 85, outside: 55, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Assemian', lastName: 'Moulare', position: 'G', age: 22, height: 184, weight: 80, stars: 1.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 70,
            playmaking: 68, ballHandling: 75, basketballIQ: 75, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 70, stealing: 68, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 82, passing: 72, inside: 65, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Yvann', lastName: 'Mbaya', position: 'C', age: 24, height: 209, weight: 110, stars: 1.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 35, threePointShot: 25, freeThrow: 67,
            playmaking: 48, ballHandling: 48, basketballIQ: 72, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 42, stealing: 62, blocking: 72,
            offensiveRebound: 72, defensiveRebound: 82
          },
          tendencies: { shooting: 60, passing: 48, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } }
    ], 'TRE': [
        { firstName: "Devante'", lastName: 'Jones', position: 'PG', age: 27, height: 185, weight: 91, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 82, freeThrow: 85,
            playmaking: 82, ballHandling: 84, basketballIQ: 92, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 78, stealing: 78, blocking: 20,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 88, passing: 85, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'D.J.', lastName: 'Steward', position: 'SG', age: 23, height: 188, weight: 75, stars: 3.0, potential: 88,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 75, freeThrow: 88,
            playmaking: 75, ballHandling: 82, basketballIQ: 78, athleticism: 88,
            interiorDefense: 32, perimeterDefense: 70, stealing: 72, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 45
          },
          tendencies: { shooting: 92, passing: 72, inside: 72, outside: 88, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Andrej', lastName: 'Jakimovski', position: 'SF', age: 24, height: 201, weight: 104, stars: 2.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 72, freeThrow: 70,
            playmaking: 55, ballHandling: 65, basketballIQ: 82, athleticism: 75,
            interiorDefense: 68, perimeterDefense: 72, stealing: 68, blocking: 35,
            offensiveRebound: 82, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 55, inside: 65, outside: 82, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Matas', lastName: 'Jogela', position: 'SF', age: 26, height: 201, weight: 90, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 80, freeThrow: 80,
            playmaking: 68, ballHandling: 72, basketballIQ: 78, athleticism: 80,
            interiorDefense: 62, perimeterDefense: 72, stealing: 62, blocking: 35,
            offensiveRebound: 40, defensiveRebound: 62
          },
          tendencies: { shooting: 82, passing: 68, inside: 65, outside: 92, defensiveAggression: 65, foulTendency: 55 } },
        { firstName: 'Peyton', lastName: 'Aldridge', position: 'PF', age: 29, height: 203, weight: 102, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 72,
            playmaking: 60, ballHandling: 65, basketballIQ: 85, athleticism: 70,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 45,
            offensiveRebound: 72, defensiveRebound: 78
          },
          tendencies: { shooting: 78, passing: 65, inside: 55, outside: 95, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Jordan Philippe', lastName: 'Bayehe', position: 'C', age: 25, height: 204, weight: 100, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 60, threePointShot: 35, freeThrow: 82,
            playmaking: 55, ballHandling: 58, basketballIQ: 75, athleticism: 82,
            interiorDefense: 78, perimeterDefense: 55, stealing: 62, blocking: 75,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 55, inside: 88, outside: 45, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Selom', lastName: 'Mawugbe', position: 'C', age: 26, height: 208, weight: 104, stars: 2.5, potential: 80,
          attributes: {
            finishing: 82, midRange: 30, threePointShot: 25, freeThrow: 55,
            playmaking: 45, ballHandling: 45, basketballIQ: 72, athleticism: 85,
            interiorDefense: 82, perimeterDefense: 40, stealing: 65, blocking: 85,
            offensiveRebound: 82, defensiveRebound: 82
          },
          tendencies: { shooting: 60, passing: 45, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 85 } },
        { firstName: 'Khalif', lastName: 'Battle', position: 'G', age: 24, height: 196, weight: 84, stars: 2.0, potential: 88,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 65, freeThrow: 95,
            playmaking: 68, ballHandling: 80, basketballIQ: 72, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 65, stealing: 65, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 85, passing: 68, inside: 75, outside: 82, defensiveAggression: 65, foulTendency: 55 } },
        { firstName: 'Toto', lastName: 'Forray', position: 'PG', age: 39, height: 188, weight: 83, stars: 2.0, potential: 70,
          attributes: {
            finishing: 65, midRange: 72, threePointShot: 68, freeThrow: 50,
            interiorDefense: 40, perimeterDefense: 75, stealing: 78, blocking: 10,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 65, passing: 85, inside: 55, outside: 75, defensiveAggression: 85, foulTendency: 45 } }
    ],
    'JER': [
        { firstName: 'Austin', lastName: 'Wiley', position: 'C', age: 26, height: 211, weight: 118, stars: 3.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 35, threePointShot: 25, freeThrow: 73,
            playmaking: 45, ballHandling: 48, basketballIQ: 82, athleticism: 85,
            interiorDefense: 85, perimeterDefense: 40, stealing: 52, blocking: 88,
            offensiveRebound: 99, defensiveRebound: 99
          },
          tendencies: { shooting: 78, passing: 45, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 85 } },
        { firstName: 'Jared', lastName: 'Harper', position: 'PG', age: 27, height: 178, weight: 79, stars: 3.5, potential: 88,
          attributes: {
            finishing: 82, midRange: 80, threePointShot: 82, freeThrow: 86,
            playmaking: 82, ballHandling: 88, basketballIQ: 85, athleticism: 90,
            interiorDefense: 30, perimeterDefense: 75, stealing: 78, blocking: 15,
            offensiveRebound: 22, defensiveRebound: 35
          },
          tendencies: { shooting: 95, passing: 82, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Cassius', lastName: 'Winston', position: 'PG', age: 27, height: 185, weight: 84, stars: 3.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 82, threePointShot: 80, freeThrow: 80,
            playmaking: 85, ballHandling: 84, basketballIQ: 92, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 82, passing: 92, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Khadeen', lastName: 'Carrington', position: 'SG', age: 29, height: 193, weight: 88, stars: 3.0, potential: 82,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 88, freeThrow: 76,
            playmaking: 72, ballHandling: 80, basketballIQ: 82, athleticism: 85,
            interiorDefense: 38, perimeterDefense: 78, stealing: 72, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 72, inside: 75, outside: 95, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Justin', lastName: 'Smith', position: 'PF', age: 26, height: 201, weight: 104, stars: 3.0, potential: 85,
          attributes: {
            finishing: 82, midRange: 60, threePointShot: 25, freeThrow: 56,
            playmaking: 52, ballHandling: 65, basketballIQ: 78, athleticism: 90,
            interiorDefense: 78, perimeterDefense: 72, stealing: 72, blocking: 82,
            offensiveRebound: 75, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 55, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Anthony', lastName: 'Lamb', position: 'SF', age: 27, height: 198, weight: 103, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 78,
            playmaking: 68, ballHandling: 72, basketballIQ: 85, athleticism: 78,
            interiorDefense: 70, perimeterDefense: 75, stealing: 72, blocking: 45,
            offensiveRebound: 62, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 72, inside: 65, outside: 92, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Yovel', lastName: 'Zoosman', position: 'SF', age: 27, height: 201, weight: 90, stars: 2.5, potential: 80,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 85, freeThrow: 75,
            playmaking: 62, ballHandling: 68, basketballIQ: 88, athleticism: 75,
            interiorDefense: 65, perimeterDefense: 85, stealing: 82, blocking: 45,
            offensiveRebound: 40, defensiveRebound: 65
          },
          tendencies: { shooting: 72, passing: 68, inside: 55, outside: 95, defensiveAggression: 88, foulTendency: 45 } },
        { firstName: 'Isaiah', lastName: 'Mobley', position: 'PF', age: 25, height: 203, weight: 108, stars: 2.5, potential: 85,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 78,
            playmaking: 68, ballHandling: 70, basketballIQ: 82, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 75, inside: 78, outside: 72, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Dmytro', lastName: 'Skapintsev', position: 'C', age: 27, height: 216, weight: 115, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 40, threePointShot: 25, freeThrow: 73,
            playmaking: 52, ballHandling: 50, basketballIQ: 75, athleticism: 72,
            interiorDefense: 82, perimeterDefense: 35, stealing: 50, blocking: 85,
            offensiveRebound: 85, defensiveRebound: 85
          },
          tendencies: { shooting: 60, passing: 52, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Roi', lastName: 'Huber', position: 'PG', age: 28, height: 188, weight: 84, stars: 2.0, potential: 75,
          attributes: {
            finishing: 68, midRange: 72, threePointShot: 75, freeThrow: 73,
            playmaking: 78, ballHandling: 75, basketballIQ: 85, athleticism: 75,
            interiorDefense: 35, perimeterDefense: 72, stealing: 68, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 65, passing: 88, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 45 } }
    ],
    'LON': [
        { firstName: 'Kameron', lastName: 'McGusty', position: 'SG', age: 27, height: 196, weight: 86, stars: 3.0, potential: 85,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 78, freeThrow: 74,
            playmaking: 72, ballHandling: 82, basketballIQ: 78, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 72, stealing: 82, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 72, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Shavar', lastName: 'Reynolds, Jr.', position: 'PG', age: 26, height: 188, weight: 84, stars: 2.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 72, freeThrow: 80,
            playmaking: 78, ballHandling: 80, basketballIQ: 80, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 75, stealing: 72, blocking: 15,
            offensiveRebound: 35, defensiveRebound: 40
          },
          tendencies: { shooting: 82, passing: 85, inside: 65, outside: 72, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Tarik', lastName: 'Phillip', position: 'G', age: 32, height: 191, weight: 88, stars: 2.5, potential: 75,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 57,
            playmaking: 80, ballHandling: 82, basketballIQ: 88, athleticism: 75,
            interiorDefense: 40, perimeterDefense: 78, stealing: 78, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 48
          },
          tendencies: { shooting: 72, passing: 92, inside: 65, outside: 85, defensiveAggression: 80, foulTendency: 55 } },
        { firstName: 'Joel', lastName: 'Scott', position: 'PF', age: 24, height: 201, weight: 102, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 68, threePointShot: 50, freeThrow: 85,
            playmaking: 55, ballHandling: 62, basketballIQ: 78, athleticism: 85,
            interiorDefense: 72, perimeterDefense: 65, stealing: 68, blocking: 35,
            offensiveRebound: 82, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 55, inside: 88, outside: 55, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Deane', lastName: 'Williams', position: 'SF', age: 28, height: 203, weight: 102, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 63,
            playmaking: 62, ballHandling: 68, basketballIQ: 82, athleticism: 88,
            interiorDefense: 72, perimeterDefense: 75, stealing: 72, blocking: 82,
            offensiveRebound: 52, defensiveRebound: 65
          },
          tendencies: { shooting: 72, passing: 62, inside: 75, outside: 75, defensiveAggression: 92, foulTendency: 65 } },
        { firstName: 'Johnathan', lastName: 'Williams', position: 'C', age: 30, height: 206, weight: 104, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 45, threePointShot: 25, freeThrow: 45,
            playmaking: 55, ballHandling: 55, basketballIQ: 75, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 42, stealing: 65, blocking: 65,
            offensiveRebound: 82, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 55, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Ethan', lastName: 'Price', position: 'C', age: 23, height: 208, weight: 104, stars: 2.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 65, threePointShot: 65, freeThrow: 89,
            playmaking: 52, ballHandling: 52, basketballIQ: 75, athleticism: 75,
            interiorDefense: 75, perimeterDefense: 40, stealing: 55, blocking: 75,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 65, passing: 52, inside: 88, outside: 65, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Karolis', lastName: 'Lukosiunas', position: 'SG', age: 28, height: 198, weight: 92, stars: 2.0, potential: 75,
          attributes: {
            finishing: 65, midRange: 72, threePointShot: 85, freeThrow: 58,
            playmaking: 58, ballHandling: 68, basketballIQ: 82, athleticism: 70,
            interiorDefense: 32, perimeterDefense: 62, stealing: 62, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 32
          },
          tendencies: { shooting: 82, passing: 65, inside: 45, outside: 99, defensiveAggression: 55, foulTendency: 35 } },
        { firstName: 'Chaundee', lastName: 'Brown, Jr.', position: 'SF', age: 26, height: 196, weight: 98, stars: 2.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 71,
            playmaking: 55, ballHandling: 72, basketballIQ: 75, athleticism: 85,
            interiorDefense: 65, perimeterDefense: 72, stealing: 60, blocking: 20,
            offensiveRebound: 42, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 55, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Chasson', lastName: 'Randle', position: 'PG', age: 33, height: 188, weight: 84, stars: 2.0, potential: 70,
          attributes: {
            finishing: 72, midRange: 78, threePointShot: 82, freeThrow: 38,
            playmaking: 65, ballHandling: 80, basketballIQ: 88, athleticism: 72,
            interiorDefense: 30, perimeterDefense: 68, stealing: 55, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 82, passing: 65, inside: 55, outside: 88, defensiveAggression: 55, foulTendency: 45 } }
    ],
    'NEP': [
        { firstName: 'Arnas', lastName: 'Velicka', position: 'PG', age: 26, height: 191, weight: 89, stars: 3.0, potential: 85,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 72, freeThrow: 69,
            playmaking: 85, ballHandling: 82, basketballIQ: 88, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 72, stealing: 78, blocking: 15,
            offensiveRebound: 28, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 95, inside: 65, outside: 78, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'James', lastName: 'Karnik', position: 'C', age: 27, height: 208, weight: 104, stars: 3.0, potential: 84,
          attributes: {
            finishing: 82, midRange: 45, threePointShot: 25, freeThrow: 83,
            playmaking: 52, ballHandling: 52, basketballIQ: 82, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 45, stealing: 62, blocking: 52,
            offensiveRebound: 92, defensiveRebound: 88
          },
          tendencies: { shooting: 82, passing: 52, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Rihards', lastName: 'Lomazs', position: 'SG', age: 29, height: 190, weight: 88, stars: 3.0, potential: 80,
          attributes: {
            finishing: 78, midRange: 78, threePointShot: 82, freeThrow: 86,
            playmaking: 72, ballHandling: 80, basketballIQ: 85, athleticism: 80,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 42
          },
          tendencies: { shooting: 88, passing: 72, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Donatas', lastName: 'Tarolis', position: 'PF', age: 31, height: 205, weight: 102, stars: 2.5, potential: 78,
          attributes: {
            finishing: 80, midRange: 72, threePointShot: 68, freeThrow: 81,
            playmaking: 60, ballHandling: 68, basketballIQ: 82, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 65, stealing: 62, blocking: 45,
            offensiveRebound: 72, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 65, inside: 85, outside: 65, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Egidijus', lastName: 'Mockevicius', position: 'C', age: 33, height: 208, weight: 108, stars: 2.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 30, threePointShot: 25, freeThrow: 76,
            playmaking: 45, ballHandling: 48, basketballIQ: 78, athleticism: 72,
            interiorDefense: 78, perimeterDefense: 40, stealing: 65, blocking: 72,
            offensiveRebound: 88, defensiveRebound: 92
          },
          tendencies: { shooting: 60, passing: 45, inside: 92, outside: 25, defensiveAggression: 82, foulTendency: 85 } },
        { firstName: 'Zane', lastName: 'Waterman', position: 'PF', age: 30, height: 203, weight: 100, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 80, freeThrow: 70,
            playmaking: 55, ballHandling: 65, basketballIQ: 78, athleticism: 78,
            interiorDefense: 68, perimeterDefense: 72, stealing: 55, blocking: 42,
            offensiveRebound: 52, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 55, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Mindaugas', lastName: 'Girdziunas', position: 'SG', age: 36, height: 188, weight: 80, stars: 2.0, potential: 68,
          attributes: {
            finishing: 68, midRange: 75, threePointShot: 82, freeThrow: 95,
            playmaking: 68, ballHandling: 72, basketballIQ: 92, athleticism: 65,
            interiorDefense: 32, perimeterDefense: 65, stealing: 62, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 32
          },
          tendencies: { shooting: 78, passing: 72, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Martynas', lastName: 'Pacevicius', position: 'C', age: 28, height: 204, weight: 102, stars: 2.0, potential: 75,
          attributes: {
            finishing: 78, midRange: 35, threePointShot: 25, freeThrow: 59,
            playmaking: 55, ballHandling: 50, basketballIQ: 75, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 45, stealing: 55, blocking: 75,
            offensiveRebound: 82, defensiveRebound: 85
          },
          tendencies: { shooting: 72, passing: 62, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Karlis', lastName: 'Silins', position: 'C', age: 28, height: 210, weight: 108, stars: 2.0, potential: 78,
          attributes: {
            finishing: 72, midRange: 40, threePointShot: 25, freeThrow: 90,
            playmaking: 48, ballHandling: 48, basketballIQ: 75, athleticism: 72,
            interiorDefense: 75, perimeterDefense: 40, stealing: 52, blocking: 85,
            offensiveRebound: 75, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 48, inside: 88, outside: 25, defensiveAggression: 75, foulTendency: 75 } },
        { firstName: 'Arnas', lastName: 'Berucka', position: 'SF', age: 28, height: 196, weight: 91, stars: 2.0, potential: 75,
          attributes: {
            finishing: 72, midRange: 72, threePointShot: 75, freeThrow: 73,
            playmaking: 58, ballHandling: 70, basketballIQ: 78, athleticism: 78,
            interiorDefense: 62, perimeterDefense: 70, stealing: 65, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 52
          },
          tendencies: { shooting: 75, passing: 65, inside: 65, outside: 82, defensiveAggression: 70, foulTendency: 55 } }
    ], 'CHE': [
        { firstName: 'Kevin', lastName: 'Yebo', position: 'C', age: 29, height: 207, weight: 99, stars: 3.0, potential: 80,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 72, freeThrow: 74,
            playmaking: 62, ballHandling: 68, basketballIQ: 82, athleticism: 80,
            interiorDefense: 72, perimeterDefense: 55, stealing: 55, blocking: 45,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 92, passing: 65, inside: 88, outside: 75, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Corey', lastName: 'Davis', position: 'PG', age: 27, height: 185, weight: 86, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 82, freeThrow: 80,
            playmaking: 82, ballHandling: 82, basketballIQ: 82, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 20,
            offensiveRebound: 25, defensiveRebound: 42
          },
          tendencies: { shooting: 82, passing: 88, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Amadou', lastName: 'Sow', position: 'PF', age: 26, height: 206, weight: 107, stars: 2.5, potential: 82,
          attributes: {
            finishing: 82, midRange: 65, threePointShot: 68, freeThrow: 78,
            playmaking: 52, ballHandling: 62, basketballIQ: 78, athleticism: 78,
            interiorDefense: 75, perimeterDefense: 50, stealing: 55, blocking: 75,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 52, inside: 88, outside: 65, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'John', lastName: 'Newman', position: 'SG', age: 25, height: 196, weight: 93, stars: 2.5, potential: 80,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 85, freeThrow: 55,
            playmaking: 62, ballHandling: 72, basketballIQ: 78, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 82, stealing: 85, blocking: 42,
            offensiveRebound: 35, defensiveRebound: 52
          },
          tendencies: { shooting: 78, passing: 65, inside: 65, outside: 85, defensiveAggression: 88, foulTendency: 45 } },
        { firstName: 'Nike', lastName: 'Sibande', position: 'SG', age: 25, height: 193, weight: 83, stars: 2.5, potential: 80,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 68, freeThrow: 84,
            playmaking: 68, ballHandling: 75, basketballIQ: 75, athleticism: 85,
            interiorDefense: 38, perimeterDefense: 72, stealing: 62, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 45
          },
          tendencies: { shooting: 82, passing: 72, inside: 75, outside: 72, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Tyron', lastName: 'Brewer', position: 'SF', age: 25, height: 201, weight: 95, stars: 2.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 68, freeThrow: 72,
            playmaking: 55, ballHandling: 68, basketballIQ: 78, athleticism: 85,
            interiorDefense: 68, perimeterDefense: 75, stealing: 88, blocking: 45,
            offensiveRebound: 52, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 55, inside: 82, outside: 65, defensiveAggression: 92, foulTendency: 55 } },
        { firstName: 'Yordan', lastName: 'Minchev', position: 'SF', age: 26, height: 203, weight: 100, stars: 2.0, potential: 75,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 65, freeThrow: 75,
            playmaking: 65, ballHandling: 70, basketballIQ: 82, athleticism: 75,
            interiorDefense: 65, perimeterDefense: 72, stealing: 78, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 68
          },
          tendencies: { shooting: 72, passing: 72, inside: 72, outside: 65, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Kostja', lastName: 'Mushidi', position: 'SG', age: 26, height: 195, weight: 95, stars: 2.0, potential: 72,
          attributes: {
            finishing: 70, midRange: 75, threePointShot: 72, freeThrow: 64,
            playmaking: 68, ballHandling: 75, basketballIQ: 78, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 68, stealing: 62, blocking: 35,
            offensiveRebound: 30, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 78, inside: 65, outside: 78, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Aher', lastName: 'Uguak', position: 'SF', age: 26, height: 201, weight: 102, stars: 2.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 75,
            playmaking: 60, ballHandling: 68, basketballIQ: 75, athleticism: 78,
            interiorDefense: 62, perimeterDefense: 70, stealing: 68, blocking: 25,
            offensiveRebound: 48, defensiveRebound: 55
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 75, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Kaza', lastName: 'Keane', position: 'PG', age: 31, height: 185, weight: 84, stars: 2.0, potential: 70,
          attributes: {
            finishing: 68, midRange: 72, threePointShot: 68, freeThrow: 72,
            playmaking: 85, ballHandling: 82, basketballIQ: 85, athleticism: 72,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 32
          },
          tendencies: { shooting: 65, passing: 95, inside: 55, outside: 72, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Jordan', lastName: 'Schakel', position: 'SG', age: 26, height: 198, weight: 91, stars: 2.0, potential: 78,
          attributes: {
            finishing: 65, midRange: 75, threePointShot: 82, freeThrow: 99,
            playmaking: 55, ballHandling: 68, basketballIQ: 82, athleticism: 72,
            interiorDefense: 32, perimeterDefense: 62, stealing: 60, blocking: 25,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 82, passing: 55, inside: 45, outside: 95, defensiveAggression: 55, foulTendency: 35 } }
    ],
    'PNI': [
        { firstName: 'Keron', lastName: 'DeShields', position: 'PG', age: 32, height: 191, weight: 86, stars: 3.0, potential: 78,
          attributes: {
            finishing: 78, midRange: 80, threePointShot: 82, freeThrow: 83,
            playmaking: 90, ballHandling: 85, basketballIQ: 88, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 35
          },
          tendencies: { shooting: 78, passing: 99, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Joe', lastName: 'Thomasson', position: 'SG', age: 31, height: 193, weight: 75, stars: 3.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 95,
            playmaking: 72, ballHandling: 80, basketballIQ: 82, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 38
          },
          tendencies: { shooting: 85, passing: 68, inside: 62, outside: 95, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Michail', lastName: 'Lountzis', position: 'G', age: 26, height: 198, weight: 91, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 68, freeThrow: 90,
            playmaking: 72, ballHandling: 78, basketballIQ: 80, athleticism: 85,
            interiorDefense: 50, perimeterDefense: 85, stealing: 85, blocking: 20,
            offensiveRebound: 52, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 72, inside: 75, outside: 72, defensiveAggression: 88, foulTendency: 65 } },
        { firstName: 'Jaylen', lastName: 'Hands', position: 'SG', age: 26, height: 191, weight: 82, stars: 2.5, potential: 85,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 80,
            playmaking: 75, ballHandling: 82, basketballIQ: 72, athleticism: 88,
            interiorDefense: 32, perimeterDefense: 65, stealing: 78, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 88, passing: 72, inside: 72, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Georgios', lastName: 'Tsalmpouris', position: 'C', age: 28, height: 216, weight: 107, stars: 2.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 80, freeThrow: 70,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 65,
            interiorDefense: 75, perimeterDefense: 55, stealing: 60, blocking: 68,
            offensiveRebound: 35, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 55, inside: 55, outside: 92, defensiveAggression: 65, foulTendency: 55 } },
        { firstName: 'Nate', lastName: 'Watson', position: 'C', age: 26, height: 208, weight: 118, stars: 2.5, potential: 80,
          attributes: {
            finishing: 80, midRange: 40, threePointShot: 25, freeThrow: 66,
            playmaking: 48, ballHandling: 50, basketballIQ: 75, athleticism: 78,
            interiorDefense: 78, perimeterDefense: 40, stealing: 62, blocking: 78,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 48, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Tyler', lastName: 'Wahl', position: 'PF', age: 24, height: 206, weight: 102, stars: 2.0, potential: 85,
          attributes: {
            finishing: 78, midRange: 65, threePointShot: 25, freeThrow: 50,
            playmaking: 55, ballHandling: 62, basketballIQ: 78, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 68, stealing: 78, blocking: 82,
            offensiveRebound: 85, defensiveRebound: 80
          },
          tendencies: { shooting: 75, passing: 62, inside: 88, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Markel', lastName: 'Starks', position: 'PG', age: 34, height: 188, weight: 79, stars: 2.0, potential: 70,
          attributes: {
            finishing: 68, midRange: 75, threePointShot: 75, freeThrow: 85,
            playmaking: 82, ballHandling: 80, basketballIQ: 88, athleticism: 72,
            interiorDefense: 30, perimeterDefense: 70, stealing: 62, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 72, passing: 88, inside: 55, outside: 82, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Nikos', lastName: 'Gkikas', position: 'PG', age: 34, height: 186, weight: 81, stars: 2.0, potential: 70,
          attributes: {
            finishing: 65, midRange: 72, threePointShot: 68, freeThrow: 62,
            playmaking: 85, ballHandling: 78, basketballIQ: 92, athleticism: 65,
            interiorDefense: 30, perimeterDefense: 72, stealing: 75, blocking: 10,
            offensiveRebound: 22, defensiveRebound: 30
          },
          tendencies: { shooting: 65, passing: 95, inside: 45, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Rocky', lastName: 'Kreuser', position: 'PF', age: 26, height: 208, weight: 111, stars: 2.0, potential: 78,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 84,
            playmaking: 55, ballHandling: 62, basketballIQ: 80, athleticism: 75,
            interiorDefense: 70, perimeterDefense: 65, stealing: 68, blocking: 45,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 78, passing: 55, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } }
    ], 'ULM': [
        { firstName: 'Chris', lastName: 'Ledlum', position: 'PF', age: 24, height: 198, weight: 102, stars: 3.0, potential: 88,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 70, freeThrow: 58,
            playmaking: 68, ballHandling: 72, basketballIQ: 82, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 72, stealing: 72, blocking: 75,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 92, passing: 68, inside: 88, outside: 72, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Mark', lastName: 'Smith', position: 'SG', age: 26, height: 193, weight: 102, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 80,
            playmaking: 65, ballHandling: 78, basketballIQ: 80, athleticism: 82,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 10,
            offensiveRebound: 35, defensiveRebound: 65
          },
          tendencies: { shooting: 88, passing: 65, inside: 65, outside: 95, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Tobias', lastName: 'Jensen', position: 'PG', age: 21, height: 198, weight: 85, stars: 2.5, potential: 88,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 81,
            playmaking: 80, ballHandling: 82, basketballIQ: 82, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 75, stealing: 75, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 78, passing: 88, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Justin', lastName: 'Simon', position: 'SF', age: 29, height: 196, weight: 98, stars: 2.5, potential: 75,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 62, freeThrow: 56,
            playmaking: 62, ballHandling: 72, basketballIQ: 85, athleticism: 88,
            interiorDefense: 72, perimeterDefense: 88, stealing: 85, blocking: 35,
            offensiveRebound: 52, defensiveRebound: 75
          },
          tendencies: { shooting: 72, passing: 65, inside: 75, outside: 62, defensiveAggression: 95, foulTendency: 65 } },
        { firstName: 'Christian', lastName: 'Sengfelder', position: 'PF', age: 30, height: 203, weight: 108, stars: 2.5, potential: 75,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 75, freeThrow: 70,
            playmaking: 55, ballHandling: 62, basketballIQ: 88, athleticism: 70,
            interiorDefense: 75, perimeterDefense: 62, stealing: 62, blocking: 32,
            offensiveRebound: 78, defensiveRebound: 72
          },
          tendencies: { shooting: 78, passing: 65, inside: 85, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Malik', lastName: 'Osborne', position: 'C', age: 27, height: 206, weight: 102, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 65, threePointShot: 72, freeThrow: 85,
            playmaking: 52, ballHandling: 58, basketballIQ: 78, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 50, stealing: 55, blocking: 35,
            offensiveRebound: 72, defensiveRebound: 85
          },
          tendencies: { shooting: 75, passing: 55, inside: 78, outside: 72, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Nelson', lastName: 'Weidemann', position: 'PG', age: 26, height: 190, weight: 82, stars: 2.0, potential: 80,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 80, freeThrow: 95,
            playmaking: 72, ballHandling: 78, basketballIQ: 82, athleticism: 80,
            interiorDefense: 30, perimeterDefense: 72, stealing: 62, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 82, passing: 78, inside: 65, outside: 88, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Bryce', lastName: 'Brown', position: 'SG', age: 28, height: 191, weight: 90, stars: 2.0, potential: 78,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 82, freeThrow: 75,
            playmaking: 68, ballHandling: 75, basketballIQ: 78, athleticism: 82,
            interiorDefense: 32, perimeterDefense: 72, stealing: 72, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 32
          },
          tendencies: { shooting: 85, passing: 72, inside: 62, outside: 92, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Len', lastName: 'Schoormann', position: 'SF', age: 23, height: 193, weight: 83, stars: 1.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 85,
            playmaking: 55, ballHandling: 68, basketballIQ: 75, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 72, stealing: 72, blocking: 15,
            offensiveRebound: 35, defensiveRebound: 40
          },
          tendencies: { shooting: 78, passing: 62, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Diego', lastName: 'Garavaglia', position: 'F', age: 18, height: 200, weight: 85, stars: 1.5, potential: 90,
          attributes: {
            finishing: 72, midRange: 68, threePointShot: 65, freeThrow: 81,
            playmaking: 52, ballHandling: 62, basketballIQ: 72, athleticism: 82,
            interiorDefense: 65, perimeterDefense: 65, stealing: 68, blocking: 75,
            offensiveRebound: 45, defensiveRebound: 52
          },
          tendencies: { shooting: 75, passing: 55, inside: 75, outside: 65, defensiveAggression: 75, foulTendency: 65 } }
    ],
    'SLA': [
        { firstName: 'Stefan', lastName: 'Djordjevic', position: 'C', age: 26, height: 206, weight: 105, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 40, threePointShot: 25, freeThrow: 61,
            playmaking: 52, ballHandling: 55, basketballIQ: 82, athleticism: 78,
            interiorDefense: 78, perimeterDefense: 45, stealing: 68, blocking: 80,
            offensiveRebound: 85, defensiveRebound: 82
          },
          tendencies: { shooting: 82, passing: 52, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Kadre', lastName: 'Gray', position: 'PG', age: 28, height: 185, weight: 86, stars: 3.0, potential: 80,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 70, freeThrow: 82,
            playmaking: 82, ballHandling: 85, basketballIQ: 82, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 32
          },
          tendencies: { shooting: 92, passing: 85, inside: 75, outside: 75, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Yusuf', lastName: 'Sanon', position: 'SG', age: 26, height: 194, weight: 88, stars: 2.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 72, freeThrow: 85,
            playmaking: 82, ballHandling: 85, basketballIQ: 78, athleticism: 85,
            interiorDefense: 38, perimeterDefense: 72, stealing: 75, blocking: 10,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 82, passing: 88, inside: 72, outside: 82, defensiveAggression: 82, foulTendency: 65 } },
        { firstName: 'Noah', lastName: 'Kirkwood', position: 'G', age: 26, height: 201, weight: 98, stars: 2.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 75, threePointShot: 78, freeThrow: 70,
            playmaking: 82, ballHandling: 78, basketballIQ: 85, athleticism: 78,
            interiorDefense: 52, perimeterDefense: 75, stealing: 72, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 62
          },
          tendencies: { shooting: 78, passing: 88, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Jakub', lastName: 'Niziol', position: 'SF', age: 29, height: 201, weight: 95, stars: 2.5, potential: 78,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 80, freeThrow: 79,
            playmaking: 72, ballHandling: 72, basketballIQ: 88, athleticism: 80,
            interiorDefense: 62, perimeterDefense: 72, stealing: 75, blocking: 35,
            offensiveRebound: 42, defensiveRebound: 52
          },
          tendencies: { shooting: 75, passing: 78, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Ajdin', lastName: 'Penava', position: 'PF', age: 28, height: 206, weight: 100, stars: 2.5, potential: 80,
          attributes: {
            finishing: 82, midRange: 65, threePointShot: 85, freeThrow: 76,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 75,
            offensiveRebound: 75, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 62, inside: 85, outside: 82, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Jakub', lastName: 'Urbaniak', position: 'C', age: 22, height: 205, weight: 102, stars: 2.0, potential: 88,
          attributes: {
            finishing: 75, midRange: 45, threePointShot: 25, freeThrow: 66,
            playmaking: 48, ballHandling: 55, basketballIQ: 75, athleticism: 80,
            interiorDefense: 72, perimeterDefense: 45, stealing: 75, blocking: 72,
            offensiveRebound: 72, defensiveRebound: 82
          },
          tendencies: { shooting: 72, passing: 48, inside: 92, outside: 25, defensiveAggression: 80, foulTendency: 75 } },
        { firstName: 'Angel', lastName: 'Nunez', position: 'PF', age: 34, height: 203, weight: 95, stars: 2.0, potential: 70,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 78, freeThrow: 62,
            playmaking: 52, ballHandling: 65, basketballIQ: 82, athleticism: 72,
            interiorDefense: 68, perimeterDefense: 65, stealing: 68, blocking: 52,
            offensiveRebound: 42, defensiveRebound: 75
          },
          tendencies: { shooting: 78, passing: 55, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Blazej', lastName: 'Kulikowski', position: 'SF', age: 25, height: 195, weight: 88, stars: 1.5, potential: 80,
          attributes: {
            finishing: 72, midRange: 72, threePointShot: 78, freeThrow: 77,
            playmaking: 55, ballHandling: 68, basketballIQ: 75, athleticism: 78,
            interiorDefense: 55, perimeterDefense: 70, stealing: 62, blocking: 10,
            offensiveRebound: 35, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 62, inside: 55, outside: 85, defensiveAggression: 70, foulTendency: 45 } },
        { firstName: 'Jared', lastName: 'Jones', position: 'PF', age: 26, height: 208, weight: 108, stars: 1.5, potential: 78,
          attributes: {
            finishing: 75, midRange: 45, threePointShot: 75, freeThrow: 50,
            playmaking: 52, ballHandling: 58, basketballIQ: 75, athleticism: 75,
            interiorDefense: 72, perimeterDefense: 50, stealing: 52, blocking: 75,
            offensiveRebound: 72, defensiveRebound: 78
          },
          tendencies: { shooting: 72, passing: 55, inside: 75, outside: 75, defensiveAggression: 75, foulTendency: 65 } }
    ],
    'ANK': [
        { firstName: 'Kyle', lastName: 'Allman, Jr.', position: 'PG', age: 27, height: 191, weight: 84, stars: 3.5, potential: 88,
          attributes: {
            finishing: 80, midRange: 82, threePointShot: 80, freeThrow: 78,
            playmaking: 82, ballHandling: 85, basketballIQ: 82, athleticism: 88,
            interiorDefense: 35, perimeterDefense: 75, stealing: 72, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 92, passing: 82, inside: 75, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Jaleen', lastName: 'Smith', position: 'SG', age: 30, height: 193, weight: 93, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 85, freeThrow: 81,
            playmaking: 78, ballHandling: 80, basketballIQ: 90, athleticism: 78,
            interiorDefense: 38, perimeterDefense: 78, stealing: 72, blocking: 15,
            offensiveRebound: 22, defensiveRebound: 38
          },
          tendencies: { shooting: 82, passing: 85, inside: 62, outside: 95, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Dogus', lastName: 'Ozdemiroglu', position: 'PG', age: 29, height: 191, weight: 88, stars: 3.0, potential: 82,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 65, freeThrow: 68,
            playmaking: 82, ballHandling: 82, basketballIQ: 85, athleticism: 85,
            interiorDefense: 50, perimeterDefense: 88, stealing: 92, blocking: 10,
            offensiveRebound: 45, defensiveRebound: 45
          },
          tendencies: { shooting: 72, passing: 88, inside: 55, outside: 72, defensiveAggression: 95, foulTendency: 65 } },
        { firstName: 'Kyle', lastName: 'Alexander', position: 'C', age: 28, height: 208, weight: 102, stars: 3.0, potential: 85,
          attributes: {
            finishing: 82, midRange: 45, threePointShot: 25, freeThrow: 76,
            playmaking: 52, ballHandling: 55, basketballIQ: 80, athleticism: 85,
            interiorDefense: 82, perimeterDefense: 45, stealing: 62, blocking: 85,
            offensiveRebound: 82, defensiveRebound: 85
          },
          tendencies: { shooting: 72, passing: 52, inside: 92, outside: 25, defensiveAggression: 82, foulTendency: 75 } },
        { firstName: 'Kris', lastName: 'Bankston', position: 'C', age: 25, height: 206, weight: 104, stars: 2.5, potential: 85,
          attributes: {
            finishing: 85, midRange: 32, threePointShot: 25, freeThrow: 66,
            playmaking: 48, ballHandling: 52, basketballIQ: 75, athleticism: 92,
            interiorDefense: 78, perimeterDefense: 40, stealing: 65, blocking: 80,
            offensiveRebound: 85, defensiveRebound: 75
          },
          tendencies: { shooting: 75, passing: 45, inside: 95, outside: 25, defensiveAggression: 88, foulTendency: 75 } },
        { firstName: 'Michael', lastName: 'Devoe', position: 'G', age: 25, height: 196, weight: 88, stars: 2.5, potential: 84,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 75, freeThrow: 79,
            playmaking: 78, ballHandling: 78, basketballIQ: 78, athleticism: 80,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 38
          },
          tendencies: { shooting: 82, passing: 85, inside: 72, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Jordan', lastName: 'Usher', position: 'SF', age: 26, height: 201, weight: 102, stars: 2.5, potential: 82,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 72, freeThrow: 75,
            playmaking: 65, ballHandling: 72, basketballIQ: 78, athleticism: 85,
            interiorDefense: 68, perimeterDefense: 75, stealing: 82, blocking: 32,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 82, passing: 68, inside: 75, outside: 78, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Uros', lastName: 'Trifunovic', position: 'SF', age: 24, height: 201, weight: 90, stars: 2.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 85, freeThrow: 82,
            playmaking: 60, ballHandling: 68, basketballIQ: 82, athleticism: 75,
            interiorDefense: 62, perimeterDefense: 72, stealing: 62, blocking: 15,
            offensiveRebound: 32, defensiveRebound: 55
          },
          tendencies: { shooting: 78, passing: 65, inside: 65, outside: 95, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Marko', lastName: 'Simonovic', position: 'PF', age: 25, height: 213, weight: 110, stars: 2.5, potential: 80,
          attributes: {
            finishing: 75, midRange: 78, threePointShot: 72, freeThrow: 87,
            playmaking: 58, ballHandling: 62, basketballIQ: 80, athleticism: 72,
            interiorDefense: 75, perimeterDefense: 60, stealing: 55, blocking: 42,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 75, passing: 68, inside: 72, outside: 78, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Berkan', lastName: 'Durmaz', position: 'PF', age: 28, height: 206, weight: 100, stars: 2.0, potential: 78,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 68, freeThrow: 71,
            playmaking: 65, ballHandling: 68, basketballIQ: 78, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 72, blocking: 45,
            offensiveRebound: 65, defensiveRebound: 85
          },
          tendencies: { shooting: 72, passing: 75, inside: 75, outside: 72, defensiveAggression: 75, foulTendency: 65 } }
    ], 'CLU': [
        { firstName: 'Dusan', lastName: 'Miletic', position: 'C', age: 26, height: 213, weight: 103, stars: 3.5, potential: 90,
          attributes: {
            finishing: 85, midRange: 45, threePointShot: 32, freeThrow: 67,
            playmaking: 55, ballHandling: 58, basketballIQ: 85, athleticism: 78,
            interiorDefense: 85, perimeterDefense: 42, stealing: 65, blocking: 88,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 82, passing: 58, inside: 95, outside: 25, defensiveAggression: 85, foulTendency: 75 } },
        { firstName: 'Fatts', lastName: 'Russell', position: 'PG', age: 26, height: 180, weight: 75, stars: 3.0, potential: 85,
          attributes: {
            finishing: 80, midRange: 75, threePointShot: 78, freeThrow: 79,
            playmaking: 82, ballHandling: 88, basketballIQ: 82, athleticism: 88,
            interiorDefense: 30, perimeterDefense: 72, stealing: 78, blocking: 15,
            offensiveRebound: 28, defensiveRebound: 35
          },
          tendencies: { shooting: 95, passing: 88, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Mitchell', lastName: 'Creek', position: 'SF', age: 33, height: 196, weight: 98, stars: 3.0, potential: 78,
          attributes: {
            finishing: 82, midRange: 82, threePointShot: 85, freeThrow: 77,
            playmaking: 68, ballHandling: 72, basketballIQ: 92, athleticism: 75,
            interiorDefense: 65, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 88, passing: 72, inside: 82, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Iverson', lastName: 'Molinar', position: 'SG', age: 25, height: 191, weight: 86, stars: 2.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 78, freeThrow: 83,
            playmaking: 72, ballHandling: 82, basketballIQ: 78, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 72, stealing: 72, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 38
          },
          tendencies: { shooting: 82, passing: 72, inside: 75, outside: 82, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Trey', lastName: 'Woodbury', position: 'G', age: 25, height: 193, weight: 91, stars: 2.5, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 82, freeThrow: 69,
            playmaking: 72, ballHandling: 75, basketballIQ: 80, athleticism: 78,
            interiorDefense: 38, perimeterDefense: 72, stealing: 75, blocking: 20,
            offensiveRebound: 32, defensiveRebound: 42
          },
          tendencies: { shooting: 78, passing: 75, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Nate', lastName: 'Mensah', position: 'C', age: 27, height: 208, weight: 104, stars: 2.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 32, threePointShot: 25, freeThrow: 60,
            playmaking: 48, ballHandling: 45, basketballIQ: 78, athleticism: 82,
            interiorDefense: 80, perimeterDefense: 38, stealing: 55, blocking: 82,
            offensiveRebound: 82, defensiveRebound: 85
          },
          tendencies: { shooting: 65, passing: 45, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 75 } },
        { firstName: 'Karel', lastName: 'Guzman', position: 'SF', age: 30, height: 188, weight: 88, stars: 2.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 67,
            playmaking: 62, ballHandling: 68, basketballIQ: 78, athleticism: 82,
            interiorDefense: 62, perimeterDefense: 75, stealing: 75, blocking: 32,
            offensiveRebound: 45, defensiveRebound: 65
          },
          tendencies: { shooting: 75, passing: 62, inside: 75, outside: 78, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Jeffery', lastName: 'Taylor', position: 'SF', age: 36, height: 201, weight: 102, stars: 2.0, potential: 70,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 68, freeThrow: 62,
            playmaking: 60, ballHandling: 65, basketballIQ: 92, athleticism: 65,
            interiorDefense: 72, perimeterDefense: 85, stealing: 75, blocking: 35,
            offensiveRebound: 32, defensiveRebound: 52
          },
          tendencies: { shooting: 65, passing: 65, inside: 65, outside: 75, defensiveAggression: 88, foulTendency: 45 } },
        { firstName: 'Patrick', lastName: 'Richard', position: 'G', age: 35, height: 193, weight: 93, stars: 2.0, potential: 70,
          attributes: {
            finishing: 68, midRange: 75, threePointShot: 78, freeThrow: 89,
            playmaking: 72, ballHandling: 72, basketballIQ: 95, athleticism: 62,
            interiorDefense: 35, perimeterDefense: 75, stealing: 62, blocking: 15,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 72, passing: 85, inside: 55, outside: 82, defensiveAggression: 75, foulTendency: 45 } },
        { firstName: 'Saulius', lastName: 'Kulvietis', position: 'PF', age: 34, height: 206, weight: 100, stars: 1.5, potential: 70,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 82, freeThrow: 80,
            playmaking: 55, ballHandling: 60, basketballIQ: 88, athleticism: 62,
            interiorDefense: 65, perimeterDefense: 55, stealing: 52, blocking: 25,
            offensiveRebound: 42, defensiveRebound: 52
          },
          tendencies: { shooting: 78, passing: 65, inside: 65, outside: 92, defensiveAggression: 65, foulTendency: 45 } }
    ], 'VEN': [
        { firstName: 'Kyle', lastName: 'Wiltjer', position: 'PF', age: 33, height: 208, weight: 109, stars: 3.0, potential: 80,
          attributes: {
            finishing: 72, midRange: 85, threePointShot: 90, freeThrow: 81,
            playmaking: 62, ballHandling: 68, basketballIQ: 88, athleticism: 65,
            interiorDefense: 55, perimeterDefense: 45, stealing: 35, blocking: 25,
            offensiveRebound: 35, defensiveRebound: 62
          },
          tendencies: { shooting: 92, passing: 65, inside: 35, outside: 99, defensiveAggression: 55, foulTendency: 45 } },
        { firstName: 'R.J.', lastName: 'Cole', position: 'PG', age: 26, height: 185, weight: 84, stars: 3.0, potential: 84,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 75, freeThrow: 91,
            playmaking: 82, ballHandling: 85, basketballIQ: 82, athleticism: 85,
            interiorDefense: 32, perimeterDefense: 72, stealing: 72, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 32
          },
          tendencies: { shooting: 85, passing: 85, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Chris', lastName: 'Horton', position: 'C', age: 31, height: 203, weight: 102, stars: 3.0, potential: 78,
          attributes: {
            finishing: 80, midRange: 35, threePointShot: 25, freeThrow: 53,
            playmaking: 55, ballHandling: 52, basketballIQ: 78, athleticism: 82,
            interiorDefense: 82, perimeterDefense: 45, stealing: 72, blocking: 85,
            offensiveRebound: 85, defensiveRebound: 88
          },
          tendencies: { shooting: 72, passing: 55, inside: 92, outside: 25, defensiveAggression: 88, foulTendency: 75 } },
        { firstName: 'Jordan', lastName: 'Parks', position: 'SF', age: 32, height: 201, weight: 92, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 65, freeThrow: 78,
            playmaking: 55, ballHandling: 68, basketballIQ: 78, athleticism: 85,
            interiorDefense: 72, perimeterDefense: 75, stealing: 78, blocking: 75,
            offensiveRebound: 55, defensiveRebound: 72
          },
          tendencies: { shooting: 82, passing: 62, inside: 75, outside: 65, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Denzel', lastName: 'Valentine', position: 'SF', age: 32, height: 193, weight: 100, stars: 2.5, potential: 75,
          attributes: {
            finishing: 72, midRange: 78, threePointShot: 78, freeThrow: 83,
            playmaking: 82, ballHandling: 78, basketballIQ: 92, athleticism: 70,
            interiorDefense: 52, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 68
          },
          tendencies: { shooting: 78, passing: 88, inside: 55, outside: 88, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Ky', lastName: 'Bowman', position: 'G', age: 28, height: 185, weight: 85, stars: 2.5, potential: 80,
          attributes: {
            finishing: 78, midRange: 72, threePointShot: 68, freeThrow: 69,
            playmaking: 75, ballHandling: 82, basketballIQ: 78, athleticism: 90,
            interiorDefense: 35, perimeterDefense: 75, stealing: 78, blocking: 15,
            offensiveRebound: 32, defensiveRebound: 45
          },
          tendencies: { shooting: 85, passing: 78, inside: 75, outside: 75, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Stefan', lastName: 'Nikolic', position: 'PF', age: 31, height: 203, weight: 95, stars: 2.5, potential: 75,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 68, freeThrow: 81,
            playmaking: 52, ballHandling: 62, basketballIQ: 82, athleticism: 75,
            interiorDefense: 68, perimeterDefense: 62, stealing: 68, blocking: 35,
            offensiveRebound: 48, defensiveRebound: 55
          },
          tendencies: { shooting: 75, passing: 62, inside: 82, outside: 65, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Carl', lastName: 'Wheatle', position: 'SF', age: 28, height: 200, weight: 88, stars: 2.0, potential: 78,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 85, freeThrow: 72,
            playmaking: 68, ballHandling: 70, basketballIQ: 80, athleticism: 80,
            interiorDefense: 62, perimeterDefense: 75, stealing: 72, blocking: 65,
            offensiveRebound: 32, defensiveRebound: 58
          },
          tendencies: { shooting: 72, passing: 72, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Amedeo', lastName: 'Tessitori', position: 'C', age: 31, height: 208, weight: 107, stars: 2.0, potential: 75,
          attributes: {
            finishing: 78, midRange: 60, threePointShot: 25, freeThrow: 64,
            playmaking: 45, ballHandling: 48, basketballIQ: 82, athleticism: 68,
            interiorDefense: 78, perimeterDefense: 42, stealing: 55, blocking: 82,
            offensiveRebound: 78, defensiveRebound: 82
          },
          tendencies: { shooting: 75, passing: 52, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 85 } },
        { firstName: 'Leonardo', lastName: 'Candi', position: 'G', age: 29, height: 190, weight: 86, stars: 2.0, potential: 75,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 78, freeThrow: 72,
            playmaking: 75, ballHandling: 78, basketballIQ: 82, athleticism: 78,
            interiorDefense: 35, perimeterDefense: 72, stealing: 75, blocking: 10,
            offensiveRebound: 22, defensiveRebound: 32
          },
          tendencies: { shooting: 75, passing: 78, inside: 62, outside: 82, defensiveAggression: 75, foulTendency: 45 } }
    ], 'HAM': [
        { firstName: 'Zacharie', lastName: 'Perrin', position: 'C', age: 21, height: 208, weight: 102, stars: 3.0, potential: 90,
          attributes: {
            finishing: 82, midRange: 40, threePointShot: 33, freeThrow: 55,
            playmaking: 55, ballHandling: 58, basketballIQ: 82, athleticism: 85,
            interiorDefense: 78, perimeterDefense: 42, stealing: 55, blocking: 75,
            offensiveRebound: 88, defensiveRebound: 92
          },
          tendencies: { shooting: 78, passing: 55, inside: 92, outside: 25, defensiveAggression: 82, foulTendency: 75 } },
        { firstName: 'Devon', lastName: 'Daniels', position: 'SG', age: 27, height: 196, weight: 91, stars: 3.0, potential: 82,
          attributes: {
            finishing: 82, midRange: 78, threePointShot: 75, freeThrow: 78,
            playmaking: 72, ballHandling: 82, basketballIQ: 80, athleticism: 85,
            interiorDefense: 35, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 38
          },
          tendencies: { shooting: 92, passing: 72, inside: 75, outside: 82, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'L.J.', lastName: 'Thorpe', position: 'PG', age: 26, height: 196, weight: 98, stars: 3.0, potential: 85,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 65, freeThrow: 84,
            playmaking: 85, ballHandling: 82, basketballIQ: 85, athleticism: 82,
            interiorDefense: 45, perimeterDefense: 72, stealing: 62, blocking: 15,
            offensiveRebound: 28, defensiveRebound: 42
          },
          tendencies: { shooting: 75, passing: 95, inside: 65, outside: 72, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Ross', lastName: 'Williams', position: 'SG', age: 25, height: 180, weight: 75, stars: 2.5, potential: 82,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 82, freeThrow: 99,
            playmaking: 65, ballHandling: 78, basketballIQ: 78, athleticism: 80,
            interiorDefense: 30, perimeterDefense: 65, stealing: 72, blocking: 10,
            offensiveRebound: 22, defensiveRebound: 32
          },
          tendencies: { shooting: 88, passing: 65, inside: 55, outside: 95, defensiveAggression: 65, foulTendency: 45 } },
        { firstName: 'Eric', lastName: 'Reed, Jr.', position: 'SF', age: 25, height: 193, weight: 88, stars: 2.5, potential: 80,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 63,
            playmaking: 60, ballHandling: 72, basketballIQ: 75, athleticism: 82,
            interiorDefense: 50, perimeterDefense: 72, stealing: 75, blocking: 25,
            offensiveRebound: 25, defensiveRebound: 35
          },
          tendencies: { shooting: 85, passing: 62, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 55 } },
        { firstName: 'Martin', lastName: 'Breunig', position: 'C', age: 33, height: 203, weight: 102, stars: 2.0, potential: 70,
          attributes: {
            finishing: 78, midRange: 75, threePointShot: 25, freeThrow: 58,
            playmaking: 58, ballHandling: 55, basketballIQ: 88, athleticism: 65,
            interiorDefense: 75, perimeterDefense: 40, stealing: 55, blocking: 72,
            offensiveRebound: 75, defensiveRebound: 72
          },
          tendencies: { shooting: 72, passing: 68, inside: 92, outside: 25, defensiveAggression: 75, foulTendency: 65 } },
        { firstName: 'Niklas', lastName: 'Wimberg', position: 'PF', age: 29, height: 206, weight: 100, stars: 2.0, potential: 75,
          attributes: {
            finishing: 72, midRange: 72, threePointShot: 75, freeThrow: 99,
            playmaking: 55, ballHandling: 62, basketballIQ: 82, athleticism: 78,
            interiorDefense: 72, perimeterDefense: 65, stealing: 75, blocking: 80,
            offensiveRebound: 55, defensiveRebound: 65
          },
          tendencies: { shooting: 65, passing: 62, inside: 65, outside: 82, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Kenneth', lastName: 'Ogbe', position: 'SF', age: 31, height: 198, weight: 95, stars: 2.0, potential: 75,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 75, freeThrow: 70,
            playmaking: 55, ballHandling: 68, basketballIQ: 80, athleticism: 82,
            interiorDefense: 65, perimeterDefense: 72, stealing: 68, blocking: 25,
            offensiveRebound: 32, defensiveRebound: 52
          },
          tendencies: { shooting: 75, passing: 62, inside: 65, outside: 85, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'J.P.', lastName: 'Tokoto', position: 'F', age: 32, height: 201, weight: 91, stars: 1.5, potential: 70,
          attributes: {
            finishing: 72, midRange: 75, threePointShot: 65, freeThrow: 66,
            playmaking: 72, ballHandling: 72, basketballIQ: 85, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 75, stealing: 62, blocking: 32,
            offensiveRebound: 45, defensiveRebound: 62
          },
          tendencies: { shooting: 65, passing: 78, inside: 65, outside: 72, defensiveAggression: 75, foulTendency: 55 } },
        { firstName: 'Carlos', lastName: 'Stewart Jr.', position: 'G', age: 23, height: 185, weight: 85, stars: 2.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 72, threePointShot: 72, freeThrow: 78,
            playmaking: 68, ballHandling: 75, basketballIQ: 75, athleticism: 85,
            interiorDefense: 32, perimeterDefense: 70, stealing: 78, blocking: 10,
            offensiveRebound: 20, defensiveRebound: 30
          },
          tendencies: { shooting: 82, passing: 72, inside: 65, outside: 82, defensiveAggression: 75, foulTendency: 55 } }
    ],
    // ─── 7BET-LIETKABELIS PANEVEZYS (LKT) ───────────────────────────────────
    'LKT': [
        { firstName: 'Augustine', lastName: 'Rubit', position: 'PF', age: 35, height: 203, weight: 104, stars: 3.5, potential: 78,
          attributes: {
            finishing: 80, midRange: 78, threePointShot: 70, freeThrow: 82,
            playmaking: 55, ballHandling: 65, basketballIQ: 84, athleticism: 68,
            interiorDefense: 72, perimeterDefense: 58, stealing: 70, blocking: 35,
            offensiveRebound: 78, defensiveRebound: 75
          },
          tendencies: { shooting: 88, passing: 65, inside: 82, outside: 75, defensiveAggression: 70, foulTendency: 85 } },
        { firstName: 'Fardaws', lastName: 'Aimaq', position: 'C', age: 26, height: 211, weight: 111, stars: 3.5, potential: 85,
          attributes: {
            finishing: 78, midRange: 40, threePointShot: 25, freeThrow: 58,
            playmaking: 60, ballHandling: 58, basketballIQ: 75, athleticism: 78,
            interiorDefense: 78, perimeterDefense: 40, stealing: 55, blocking: 82,
            offensiveRebound: 95, defensiveRebound: 92
          },
          tendencies: { shooting: 82, passing: 68, inside: 95, outside: 25, defensiveAggression: 82, foulTendency: 75 } },
        { firstName: 'Michael', lastName: 'Flowers', position: 'PG', age: 26, height: 185, weight: 86, stars: 3.0, potential: 84,
          attributes: {
            finishing: 75, midRange: 76, threePointShot: 78, freeThrow: 80,
            playmaking: 80, ballHandling: 82, basketballIQ: 80, athleticism: 78,
            interiorDefense: 40, perimeterDefense: 70, stealing: 75, blocking: 30,
            offensiveRebound: 30, defensiveRebound: 48
          },
          tendencies: { shooting: 85, passing: 88, inside: 65, outside: 88, defensiveAggression: 75, foulTendency: 50 } },
        { firstName: 'Jamel', lastName: 'Morris', position: 'SG', age: 33, height: 193, weight: 88, stars: 3.0, potential: 70,
          attributes: {
            finishing: 72, midRange: 78, threePointShot: 82, freeThrow: 75,
            playmaking: 68, ballHandling: 75, basketballIQ: 75, athleticism: 75,
            interiorDefense: 35, perimeterDefense: 62, stealing: 55, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 40
          },
          tendencies: { shooting: 99, passing: 65, inside: 55, outside: 94, defensiveAggression: 60, foulTendency: 45 } },
        { firstName: 'Gabas', lastName: 'Maldunas', position: 'C', age: 32, height: 204, weight: 104, stars: 3.0, potential: 75,
          attributes: {
            finishing: 82, midRange: 40, threePointShot: 25, freeThrow: 65,
            playmaking: 68, ballHandling: 58, basketballIQ: 85, athleticism: 72,
            interiorDefense: 75, perimeterDefense: 50, stealing: 75, blocking: 75,
            offensiveRebound: 82, defensiveRebound: 78
          },
          tendencies: { shooting: 65, passing: 78, inside: 92, outside: 25, defensiveAggression: 85, foulTendency: 65 } },
        { firstName: 'Paulius', lastName: 'Danusevicius', position: 'PF', age: 24, height: 205, weight: 102, stars: 3.0, potential: 82,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 68, freeThrow: 58,
            playmaking: 62, ballHandling: 65, basketballIQ: 78, athleticism: 82,
            interiorDefense: 72, perimeterDefense: 65, stealing: 55, blocking: 80,
            offensiveRebound: 82, defensiveRebound: 78
          },
          tendencies: { shooting: 82, passing: 68, inside: 85, outside: 75, defensiveAggression: 80, foulTendency: 65 } },
        { firstName: 'Nojus', lastName: 'Radzius', position: 'SG', age: 19, height: 194, weight: 88, stars: 2.5, potential: 92,
          attributes: {
            finishing: 68, midRange: 75, threePointShot: 85, freeThrow: 88,
            playmaking: 78, ballHandling: 78, basketballIQ: 78, athleticism: 75,
            interiorDefense: 45, perimeterDefense: 85, stealing: 92, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 40
          },
          tendencies: { shooting: 55, passing: 82, inside: 45, outside: 95, defensiveAggression: 92, foulTendency: 45 } },
        { firstName: 'Vytenis', lastName: 'Lipkevicius', position: 'SF', age: 36, height: 198, weight: 98, stars: 2.5, potential: 68,
          attributes: {
            finishing: 68, midRange: 75, threePointShot: 80, freeThrow: 84,
            playmaking: 68, ballHandling: 68, basketballIQ: 92, athleticism: 58,
            interiorDefense: 65, perimeterDefense: 78, stealing: 70, blocking: 25,
            offensiveRebound: 40, defensiveRebound: 68
          },
          tendencies: { shooting: 65, passing: 78, inside: 55, outside: 92, defensiveAggression: 80, foulTendency: 45 } },
        { firstName: 'Kristian', lastName: 'Kullamae', position: 'SG', age: 26, height: 194, weight: 89, stars: 2.5, potential: 78,
          attributes: {
            finishing: 72, midRange: 70, threePointShot: 75, freeThrow: 72,
            playmaking: 75, ballHandling: 78, basketballIQ: 78, athleticism: 78,
            interiorDefense: 40, perimeterDefense: 68, stealing: 72, blocking: 25,
            offensiveRebound: 30, defensiveRebound: 48
          },
          tendencies: { shooting: 88, passing: 82, inside: 65, outside: 85, defensiveAggression: 70, foulTendency: 50 } },
        { firstName: 'Justas', lastName: 'Furmanavicius', position: 'SF', age: 31, height: 199, weight: 102, stars: 2.0, potential: 72,
          attributes: {
            finishing: 75, midRange: 68, threePointShot: 68, freeThrow: 75,
            playmaking: 55, ballHandling: 65, basketballIQ: 75, athleticism: 78,
            interiorDefense: 62, perimeterDefense: 70, stealing: 85, blocking: 40,
            offensiveRebound: 48, defensiveRebound: 58
          },
          tendencies: { shooting: 75, passing: 62, inside: 85, outside: 75, defensiveAggression: 88, foulTendency: 55 } },
        { firstName: 'Dovis', lastName: 'Bickauskis', position: 'PG', age: 32, height: 191, weight: 88, stars: 2.0, potential: 72,
          attributes: {
            finishing: 70, midRange: 70, threePointShot: 72, freeThrow: 70,
            playmaking: 75, ballHandling: 75, basketballIQ: 82, athleticism: 75,
            interiorDefense: 40, perimeterDefense: 75, stealing: 78, blocking: 30,
            offensiveRebound: 35, defensiveRebound: 48
          },
          tendencies: { shooting: 72, passing: 85, inside: 65, outside: 78, defensiveAggression: 82, foulTendency: 55 } },
        { firstName: 'Lazar', lastName: 'Mutic', position: 'PF', age: 26, height: 204, weight: 104, stars: 1.5, potential: 72,
          attributes: {
            finishing: 68, midRange: 62, threePointShot: 62, freeThrow: 55,
            playmaking: 50, ballHandling: 58, basketballIQ: 72, athleticism: 75,
            interiorDefense: 68, perimeterDefense: 55, stealing: 62, blocking: 40,
            offensiveRebound: 75, defensiveRebound: 78
          },
          tendencies: { shooting: 65, passing: 52, inside: 82, outside: 55, defensiveAggression: 70, foulTendency: 65 } },
        { firstName: 'Danielius', lastName: 'Lavrinovicius', position: 'C', age: 26, height: 206, weight: 105, stars: 1.5, potential: 72,
          attributes: {
            finishing: 75, midRange: 58, threePointShot: 25, freeThrow: 52,
            playmaking: 48, ballHandling: 48, basketballIQ: 75, athleticism: 72,
            interiorDefense: 72, perimeterDefense: 40, stealing: 55, blocking: 72,
            offensiveRebound: 68, defensiveRebound: 70
          },
          tendencies: { shooting: 62, passing: 45, inside: 92, outside: 25, defensiveAggression: 75, foulTendency: 70 } },
        { firstName: 'Nojus', lastName: 'Kuliesa', position: 'SG', age: 19, height: 191, weight: 85, stars: 1.0, potential: 85,
          attributes: {
            finishing: 65, midRange: 58, threePointShot: 58, freeThrow: 55,
            playmaking: 62, ballHandling: 65, basketballIQ: 70, athleticism: 75,
            interiorDefense: 30, perimeterDefense: 58, stealing: 50, blocking: 25,
            offensiveRebound: 58, defensiveRebound: 60
          },
          tendencies: { shooting: 75, passing: 65, inside: 60, outside: 75, defensiveAggression: 60, foulTendency: 45 } }
    ]
};
