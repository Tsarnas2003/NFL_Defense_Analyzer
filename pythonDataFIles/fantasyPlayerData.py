import nfl_data_py as nfl
import pandas as pd
import json
import os

# Pull weekly player stats — this has fantasy points built in
df = nfl.import_weekly_data([2022, 2023, 2024])

# See what columns are available

filtered = df[
    (df['season_type']== 'REG') &
    (df['position'].isin(['QB', 'RB', 'WR', 'TE', 'K']))
]


seasonTotals = filtered.groupby([
    'season', 
    'player_display_name', 
    'position',
    'recent_team',
    'headshot_url']).agg(
        Fantasy_Points = ('fantasy_points_ppr', 'sum')
    ).reset_index()


seasonTotals['Fantasy_Points'] = seasonTotals['Fantasy_Points'].round(1)




print(seasonTotals.sort_values('Fantasy_Points', ascending=False).head(10))

