import nfl_data_py as nfl

# Load a full season of play by play
df = nfl.import_pbp_data([2025])


# Look at what columns exist
print("Done! Shape:", df.shape)
print("\nCoverage value counts:")
print(df['defense_coverage_type'].value_counts())


#filter 
coverage_plays = df[
    (df['play_type'] == 'pass') &
    (df['defense_coverage_type'].notna())&
    (df['home_team'] == 'BAL') | (df['away_team'] == 'BAL') &
    (df['home_team'] == 'KC') | (df['away_team'] == 'KC')
][['desc',  'defteam', 'defense_coverage_type', 'down',
     'home_team','week', 'away_team','defense_personnel', 'drive','yardline_100','complete_pass','quarter_seconds_remaining','passer_player_name']]

#other possible useful things yardline_100, side_of_field, drive, game_half
cover2RavensVsChiefs = coverage_plays[
   (coverage_plays['defense_coverage_type'] == 'COVER_2') &
   ((coverage_plays['drive']== 1.0)) &
   ((coverage_plays['home_team'] == 'BAL') | (coverage_plays['away_team'] == 'BAL')) &
    ((coverage_plays['home_team'] == 'KC') | (coverage_plays['away_team'] == 'KC'))
]

# cover2RavensVsChiefs = coverage_plays[
#     ((coverage_plays['defense_coverage_type'] == 'COVER_2')) &
#      ((coverage_plays['week']== 1.0)) &
#     ((coverage_plays['home_team'] == 'CAR') | (coverage_plays['away_team'] == 'CAR')) &
#     ((coverage_plays['home_team'] == 'JAX') | (coverage_plays['away_team'] == 'JAX'))
# ]

# print(f"Total Cover 2 plays: {len(cover2RavensVsChiefs)}")
# print("\nSample plays:")
print(coverage_plays.head(20))