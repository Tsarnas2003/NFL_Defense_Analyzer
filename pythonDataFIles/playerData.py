import nfl_data_py as nfl
import pandas as pd
import json
import os


# Load a full season of play by play
df = nfl.import_pbp_data([2024,2025])





passes = df[
    (df['play_type'] == 'pass') &
    (df['defense_coverage_type'].notna())&
    (df['passer_player_name'].notna())

]

qb_stats = passes.groupby(['season', 'passer_player_name', 'defense_coverage_type']).agg(
    Attempts =('complete_pass', 'count'),
    Completions =('complete_pass', 'sum'),
    Completion_Pct =('complete_pass', 'mean'),
    Yards = ('passing_yards', 'sum'),
    Touchdowns = ('touchdown', 'sum'),
    Interceptions = ('interception', 'sum')
).reset_index()


qb_stats['Season'] = 2025

qb_stats_filtered = qb_stats[qb_stats['Attempts'] > 25]
qb_stats_filtered['Completion_Pct'] = qb_stats_filtered['Completion_Pct'].round(2)*100
qb_stats_filtered['Completions'] = qb_stats_filtered['Completions'].astype(int)
qb_stats_filtered['Completion_Pct'] = qb_stats_filtered['Completion_Pct'].round(2)



# summary = pd.DataFrame([{
#     'Player': 'Patrick Mahomes',
#     'Season': 2025,
#     'Coverage': 'Cover 2',
#     'Attempts': pass_attempts,
#     'Completions': completions,
#     'Completion %': round(completion_pct, 2)
# }])

print("Sample QB stats:")
print(qb_stats_filtered.head(10))
print(f"\nTotal QB coverage combinations: {len(qb_stats_filtered)}")

## Defense stats 

defTendencies= passes.groupby(['season', 'defteam', 'defense_coverage_type']).agg(
    plays = ('defense_coverage_type', 'count'),
).reset_index()


team_totals = defTendencies.groupby(['season', 'defteam'])['plays'].transform('sum')
defTendencies['percentage'] = (defTendencies['plays'] / team_totals * 100).round(1)


print("\nSample defensive tendencies:")
print(defTendencies.head(10))


# Wr Stats 


wideReceiverStats = passes[passes['receiver_player_name'].notna()].groupby([
    'season',
    'receiver_player_name',
    'defense_coverage_type'

]).agg(
    Targets = ('receiver_player_name', 'count'),
    Receptions = ('complete_pass', 'sum'),
    Yards = ('receiving_yards', 'sum'),
    Touchdown = ('pass_touchdown','sum')
).reset_index()



wideReceiverStats['yards_per_target'] = (wideReceiverStats['Yards'] / wideReceiverStats['Targets']).round(1)
wideReceiverStats = wideReceiverStats[wideReceiverStats['Targets'] >= 20]

print("\nSample WR stats:")
print(wideReceiverStats.head(10))



OUTPUT_DIR = r"C:\Users\tbone\OneDrive\Desktop\Football Project\nfl-defense-analyzer\public\data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── QB STATS JSON ──────────────────────────────────────
qb_json = {}

for _, row in qb_stats_filtered.iterrows():
    season = str(int(row['season']))
    player = row['passer_player_name']
    coverage = row['defense_coverage_type']

    if season not in qb_json:
        qb_json[season] = {}
    if player not in qb_json[season]:
        qb_json[season][player] = {}

    qb_json[season][player][coverage] = {
        'attempts': int(row['Attempts']),
        'completions': int(row['Completions']),
        'yards': int(row['Yards']),
        'touchdowns': int(row['Touchdowns']),
        'interceptions': int(row['Interceptions']),
        'completion_pct': float(row['Completion_Pct']),
    }

    tendencies_json = {}

    for _, row in defTendencies.iterrows():
        season = str(int(row['season']))
        team = row['defteam']
        coverage = row['defense_coverage_type']

        if season not in tendencies_json:
            tendencies_json[season] = {}
        if team not in tendencies_json[season]:
            tendencies_json[season][team] = {}

        tendencies_json[season][team][coverage] = {
            'plays': int(row['plays']),
            'percentage': float(row['percentage'])
        }
        

    wideReceivers_json = {}

  
for _, row in wideReceiverStats.iterrows():
    season = str(int(row['season']))
    player = row['receiver_player_name']
    coverage = row['defense_coverage_type']

    if season not in wideReceivers_json:
        wideReceivers_json[season] = {}
    if player not in wideReceivers_json[season]:
        wideReceivers_json[season][player] = {}

    wideReceivers_json[season][player][coverage] = {
        'targets': int(row['Targets']),
        'receptions': int(row['Receptions']),
        'yards': int(row['Yards']),
        'touchdowns': int(row['Touchdown']),
        'yards_per_target': float(row['yards_per_target'])
    }



with open(os.path.join(OUTPUT_DIR, 'qb_stats.json'), 'w') as f:
    json.dump(qb_json, f)
    print("✅ Saved qb_stats.json")

with open(os.path.join(OUTPUT_DIR, 'defensive_tendencies.json'), 'w') as f:
    json.dump(tendencies_json, f)
    print("✅ Saved defensive_tendencies.json")

with open(os.path.join(OUTPUT_DIR, 'wr_stats.json'), 'w') as f:
    json.dump(wideReceivers_json, f)
    print("✅ Saved wr_stats.json")

