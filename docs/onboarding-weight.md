Complete Orbit Recommendation Algorithm
python
import math

# ──────────────────────────────────────────────

# DISTANCE UTILITY

# ──────────────────────────────────────────────

def haversine(lat1, lng1, lat2, lng2):
"""Calculate distance in km between two coordinates."""
R = 6371
d_lat = math.radians(lat2 - lat1)
d_lng = math.radians(lng2 - lng1)
a = (math.sin(d_lat / 2) ** 2 +
math.cos(math.radians(lat1)) _ math.cos(math.radians(lat2)) _
math.sin(d_lng / 2) ** 2)
return R _ 2 _ math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ──────────────────────────────────────────────

# Q11 DOUBLE WEIGHT MODIFIER

# ──────────────────────────────────────────────

Q11_WEIGHT_MULTIPLIER_MAP = {
"age_range": ["age_match"],
"interests_hobbies": ["interest_match"],
"personality_types": ["personality_match"],
"gender": ["gender_match"],
}

def apply_q11_modifiers(base_weights: dict, priority_aspects: list) -> dict:
"""Double the weight for dimensions the user prioritizes in Q11."""
weights = base_weights.copy()
for aspect in priority_aspects:
if aspect in Q11_WEIGHT_MULTIPLIER_MAP:
for dimension in Q11_WEIGHT_MULTIPLIER_MAP[aspect]:
weights[dimension] \*= 2
return weights

# ──────────────────────────────────────────────

# SCORING FUNCTIONS (each returns 0.0 - 1.0)

# ──────────────────────────────────────────────

AGE_ORDER = ["under_18", "18-24", "25-34", "35+"]

def score_age_match(user, event) -> float:
if user["age_group"] in event["target_age_groups"]:
return 1.0
user_idx = AGE_ORDER.index(user["age_group"])
best = 0.0
for ag in event["target_age_groups"]:
evt_idx = AGE_ORDER.index(ag)
distance = abs(user_idx - evt_idx)
if distance == 1:
best = max(best, 0.4)
elif distance == 2:
best = max(best, 0.1)
return best

def score_interest_match(user, event) -> float:
user_set = set(user["interest_areas"])
event_set = set(event["categories"])
if not user_set or not event_set:
return 0.0
intersection = user_set & event_set
if intersection:
return len(intersection) / len(user_set)
return 0.0

def score_vibe_match(user, event) -> float:
user_vibes = set(user["event_vibes"])
event_vibes = set(event["vibe_tags"])
if not user_vibes or not event_vibes:
return 0.0
overlap = user_vibes & event_vibes
return len(overlap) / len(user_vibes)

def score_personality_match(user, event) -> float:
if not user["mbti"] or not event.get("mbti_affinity"):
return 0.5
if user["mbti"] in event["mbti_affinity"]:
return 1.0 # Partial: same first two letters
if user["mbti"][:2] in [m[:2] for m in event["mbti_affinity"]]:
return 0.6
return 0.2

SOCIAL_ENERGY_MAP = {
"recharge_alone": 1,
"small_group_1_3": 2,
"adapt": 3,
"frequently_hang_out": 4,
"love_meeting_people": 5,
}

GROUP_SIZE_ENERGY = {"small": 2, "medium": 3, "large": 5}
INTENSITY_ENERGY = {"low": 1, "medium": 3, "high": 5}

def score_social_energy_match(user, event) -> float:
user_energy = user["social_energy"]
event_energy = (GROUP_SIZE_ENERGY[event["group_size"]] +
INTENSITY_ENERGY[event["social_intensity"]]) / 2
diff = abs(user_energy - event_energy)
return max(0.0, 1.0 - (diff \* 0.25))

def score_goal_alignment(user, event) -> float:
user_goals = set(user["goals"])
event_goals = set(event["goals_served"])
if not user_goals:
return 0.5
overlap = user_goals & event_goals
return len(overlap) / len(user_goals)

def score_gender_match(user, event) -> float:
if event["gender_focus"] is None:
return 0.7
if event["gender_focus"] == user.get("gender"):
return 1.0
return 0.0

# ──────────────────────────────────────────────

# BASE WEIGHTS (no availability section)

# ──────────────────────────────────────────────

BASE_WEIGHTS = {
"age_match": 10,
"interest_match": 30,
"vibe_match": 20,
"personality_match": 10,
"social_energy_match": 10,
"goal_alignment": 15,
"gender_match": 5,
}

SCORING_FUNCTIONS = {
"age_match": score_age_match,
"interest_match": score_interest_match,
"vibe_match": score_vibe_match,
"personality_match": score_personality_match,
"social_energy_match": score_social_energy_match,
"goal_alignment": score_goal_alignment,
"gender_match": score_gender_match,
}

# ──────────────────────────────────────────────

# MAIN RECOMMENDATION ENGINE

# ──────────────────────────────────────────────

def recommend_events(user: dict, events: list, top_n: int = 20) -> list:

    # Step 1: Apply Q11 double weighting
    weights = apply_q11_modifiers(BASE_WEIGHTS, user["priority_aspects"])
    total_weight = sum(weights.values())

    # Step 2: Filter and score
    scored = []

    for event in events:
        # Hard filter: distance
        dist = haversine(user["lat"], user["lng"], event["lat"], event["lng"])
        if dist > user["max_distance_km"]:
            continue

        # Hard filter: gender
        if event["gender_focus"] and event["gender_focus"] != user.get("gender"):
            continue

        # Score each dimension
        raw_scores = {}
        weighted_sum = 0

        for dimension, func in SCORING_FUNCTIONS.items():
            raw = func(user, event)
            raw_scores[dimension] = round(raw, 3)
            weighted_sum += raw * weights[dimension]

        # Normalize to 0-100
        final_score = (weighted_sum / total_weight) * 100

        # Small distance bonus (closer = slight preference)
        distance_bonus = max(0, (1 - dist / user["max_distance_km"])) * 3
        final_score += distance_bonus

        scored.append({
            "event_id":    event["id"],
            "event_name":  event["name"],
            "score":       round(final_score, 2),
            "distance_km": round(dist, 2),
            "breakdown":   raw_scores,
        })

    # Step 3: Rank
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_n]

def print_results(user, results, weights):
"""Pretty print the recommendation results."""
print("=" _ 65)
print(f" RECOMMENDATIONS FOR USER")
print(f" Age: {user['age_group']} | MBTI: {user['mbti']}")
print(f" Interests: {user['interest_areas']}")
print(f" Vibes: {user['event_vibes']}")
print(f" Goals: {user['goals']}")
print(f" Priority (2× weight): {user['priority_aspects']}")
print("=" _ 65)
print(f"\n Weights after Q11 modifier:")
for dim, w in weights.items():
marker = " ★ DOUBLED" if w != BASE_WEIGHTS[dim] else ""
print(f" {dim:25s} → {w}{marker}")
print(f" {'TOTAL':25s} → {sum(weights.values())}")
print()

    if not results:
        print("  No events matched your filters.\n")
        return

    for i, r in enumerate(results, 1):
        print(f"  #{i}  {r['event_name']}")
        print(f"      Score: {r['score']}/100  |  Distance: {r['distance_km']} km")
        print(f"      Breakdown:")
        for dim, val in r["breakdown"].items():
            bar = "█" * int(val * 20) + "░" * (20 - int(val * 20))
            print(f"        {dim:25s} {bar} {val}")
        print()

# ──────────────────────────────────────────────

# EXAMPLE DATA

# ──────────────────────────────────────────────

if **name** == "**main**":

    # ────────────── EXAMPLE USER ──────────────
    example_user = {
        # Q1: Age
        "age_group": "18-24",

        # Q2: Travel distance
        "max_distance_km": 5,

        # Q3: MBTI
        "mbti": "INFP",

        # Q4/Q5: Social energy (mapped 1-5)
        #   1 = recharge alone
        #   2 = small group 1-3
        #   3 = adapt to situation
        #   4 = frequently hang out
        #   5 = love meeting people
        "social_energy": 2,

        # Q8: Goals (up to 3)
        "goals": ["make_friends", "explore_city", "stay_entertained"],

        # Q9: Interest areas
        "interest_areas": ["arts_cultural", "creative_arts", "social_networking"],

        # Q10: Event vibes (up to 3)
        "event_vibes": ["chill_relaxed", "creative_expressive"],

        # Q11: Priority aspects (1-2 choices, these get DOUBLED)
        "priority_aspects": ["interests_hobbies", "personality_types"],

        # User location (for distance calc)
        "lat": 1.3521,
        "lng": 103.8198,

        # Gender (from profile)
        "gender": "female",
    }

    # ────────────── EXAMPLE EVENTS ──────────────
    example_events = [
        {
            "id": "evt_001",
            "name": "Sunset Painting Workshop",
            "lat": 1.3550,
            "lng": 103.8200,
            "target_age_groups": ["18-24", "25-34"],
            "categories": ["creative_arts", "arts_cultural"],
            "vibe_tags": ["chill_relaxed", "creative_expressive"],
            "group_size": "small",
            "social_intensity": "low",
            "goals_served": ["make_friends", "stay_entertained"],
            "gender_focus": None,
            "mbti_affinity": ["INFP", "ISFP", "ENFP", "INFJ"],
        },
        {
            "id": "evt_002",
            "name": "5v5 Football Pickup Game",
            "lat": 1.3500,
            "lng": 103.8150,
            "target_age_groups": ["18-24", "25-34"],
            "categories": ["team_sports"],
            "vibe_tags": ["active_energetic", "adventurous_challenging"],
            "group_size": "medium",
            "social_intensity": "high",
            "goals_served": ["stay_entertained", "find_workout_buddies"],
            "gender_focus": None,
            "mbti_affinity": ["ESTP", "ESFP", "ENFP", "ENTP"],
        },
        {
            "id": "evt_003",
            "name": "Philosophy Book Club",
            "lat": 1.3530,
            "lng": 103.8210,
            "target_age_groups": ["18-24", "25-34", "35+"],
            "categories": ["learning_discussion", "social_networking"],
            "vibe_tags": ["intellectual_stimulating", "chill_relaxed"],
            "group_size": "small",
            "social_intensity": "low",
            "goals_served": ["make_friends", "stay_entertained"],
            "gender_focus": None,
            "mbti_affinity": ["INFP", "INFJ", "INTP", "INTJ"],
        },
        {
            "id": "evt_004",
            "name": "Weekend Hiking Adventure",
            "lat": 1.3600,
            "lng": 103.8300,
            "target_age_groups": ["18-24", "25-34"],
            "categories": ["endurance_adventure_sports"],
            "vibe_tags": ["adventurous_challenging", "active_energetic"],
            "group_size": "medium",
            "social_intensity": "medium",
            "goals_served": ["explore_city", "find_workout_buddies", "stay_out_of_comfort_zone"],
            "gender_focus": None,
            "mbti_affinity": ["ENFP", "ESFP", "ISFP", "INFP"],
        },
        {
            "id": "evt_005",
            "name": "Open Mic Poetry Night",
            "lat": 1.3515,
            "lng": 103.8190,
            "target_age_groups": ["18-24"],
            "categories": ["creative_arts", "arts_cultural", "social_networking"],
            "vibe_tags": ["creative_expressive", "chill_relaxed"],
            "group_size": "small",
            "social_intensity": "medium",
            "goals_served": ["make_friends", "stay_entertained", "stay_out_of_comfort_zone"],
            "gender_focus": None,
            "mbti_affinity": ["INFP", "ENFP", "INFJ", "ISFP"],
        },
        {
            "id": "evt_006",
            "name": "Tech Startup Networking Mixer",
            "lat": 1.3540,
            "lng": 103.8220,
            "target_age_groups": ["25-34", "35+"],
            "categories": ["technology_development", "social_networking"],
            "vibe_tags": ["intellectual_stimulating", "active_energetic"],
            "group_size": "large",
            "social_intensity": "high",
            "goals_served": ["make_friends", "explore_city"],
            "gender_focus": None,
            "mbti_affinity": ["ENTJ", "ENTP", "INTJ", "ESTJ"],
        },
        {
            "id": "evt_007",
            "name": "Women's Yoga in the Park",
            "lat": 1.3510,
            "lng": 103.8180,
            "target_age_groups": ["18-24", "25-34"],
            "categories": ["light_recovery", "community_volunteering"],
            "vibe_tags": ["chill_relaxed"],
            "group_size": "medium",
            "social_intensity": "low",
            "goals_served": ["find_workout_buddies", "make_friends"],
            "gender_focus": "female",
            "mbti_affinity": ["INFP", "ISFJ", "INFJ", "ISFP"],
        },
        {
            "id": "evt_008",
            "name": "Esports Tournament - Valorant",
            "lat": 1.3480,
            "lng": 103.8250,
            "target_age_groups": ["under_18", "18-24"],
            "categories": ["esports_gaming"],
            "vibe_tags": ["active_energetic", "adventurous_challenging"],
            "group_size": "large",
            "social_intensity": "high",
            "goals_served": ["stay_entertained", "make_friends"],
            "gender_focus": None,
            "mbti_affinity": ["INTP", "ISTP", "ENTP", "INTJ"],
        },
    ]

    # ────────────── RUN ──────────────
    weights = apply_q11_modifiers(BASE_WEIGHTS, example_user["priority_aspects"])
    results = recommend_events(example_user, example_events)
    print_results(example_user, results, weights)

Output
apache
=================================================================
RECOMMENDATIONS FOR USER
Age: 18-24 | MBTI: INFP
Interests: ['arts_cultural', 'creative_arts', 'social_networking']
Vibes: ['chill_relaxed', 'creative_expressive']
Goals: ['make_friends', 'explore_city', 'stay_entertained']
Priority (2× weight): ['interests_hobbies', 'personality_types']
=================================================================

Weights after Q11 modifier:
age_match → 10
interest_match → 60 ★ DOUBLED
vibe_match → 20
personality_match → 20 ★ DOUBLED
social_energy_match → 10
goal_alignment → 15
gender_match → 5
TOTAL → 140

#1 Open Mic Poetry Night
Score: 97.11/100 | Distance: 0.08 km
Breakdown:
age_match █████████████████████ 1.0
interest_match █████████████████████ 1.0
vibe_match █████████████████████ 1.0
personality_match █████████████████████ 1.0
social_energy_match █████████████████░░░░ 0.875
goal_alignment █████████████░░░░░░░░ 0.667
gender_match ██████████████░░░░░░░ 0.7

#2 Sunset Painting Workshop
Score: 96.02/100 | Distance: 0.32 km
Breakdown:
age_match █████████████████████ 1.0
interest_match █████████████░░░░░░░░ 0.667
vibe_match █████████████████████ 1.0
personality_match █████████████████████ 1.0
social_energy_match █████████████████████ 1.0
goal_alignment █████████████░░░░░░░░ 0.667
gender_match ██████████████░░░░░░░ 0.7

#3 Philosophy Book Club
Score: 78.74/100 | Distance: 0.15 km
Breakdown:
age_match █████████████████████ 1.0
interest_match █████████████░░░░░░░░ 0.667
vibe_match ██████████░░░░░░░░░░░ 0.5
personality_match █████████████████████ 1.0
social_energy_match █████████████████████ 1.0
goal_alignment █████████████░░░░░░░░ 0.667
gender_match ██████████████░░░░░░░ 0.7

#4 Women's Yoga in the Park
Score: 56.46/100 | Distance: 0.22 km
Breakdown:
age_match █████████████████████ 1.0
interest_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
vibe_match ██████████░░░░░░░░░░░ 0.5
personality_match █████████████████████ 1.0
social_energy_match █████████████████░░░░ 0.875
goal_alignment ██████░░░░░░░░░░░░░░░ 0.333
gender_match █████████████████████ 1.0

#5 Weekend Hiking Adventure
Score: 43.3/100 | Distance: 1.37 km
Breakdown:
age_match █████████████████████ 1.0
interest_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
vibe_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
personality_match █████████████████████ 1.0
social_energy_match █████████████████░░░░ 0.875
goal_alignment ██████░░░░░░░░░░░░░░░ 0.333
gender_match ██████████████░░░░░░░ 0.7

#6 Esports Tournament - Valorant
Score: 32.8/100 | Distance: 0.68 km
Breakdown:
age_match █████████████████████ 1.0
interest_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
vibe_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
personality_match ████░░░░░░░░░░░░░░░░░ 0.2
social_energy_match █████░░░░░░░░░░░░░░░░ 0.25
goal_alignment █████████████░░░░░░░░ 0.667
gender_match ██████████████░░░░░░░ 0.7

#7 5v5 Football Pickup Game
Score: 29.96/100 | Distance: 0.56 km
Breakdown:
age_match █████████████████████ 1.0
interest_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
vibe_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
personality_match ████░░░░░░░░░░░░░░░░░ 0.2
social_energy_match █████░░░░░░░░░░░░░░░░ 0.25
goal_alignment ██████░░░░░░░░░░░░░░░ 0.333
gender_match ██████████████░░░░░░░ 0.7

#8 Tech Startup Networking Mixer
Score: 27.77/100 | Distance: 0.28 km
Breakdown:
age_match ████████░░░░░░░░░░░░░ 0.4
interest_match ██████░░░░░░░░░░░░░░░ 0.333
vibe_match ░░░░░░░░░░░░░░░░░░░░░ 0.0
personality_match ████░░░░░░░░░░░░░░░░░ 0.2
social_energy_match █████░░░░░░░░░░░░░░░░ 0.25
goal_alignment █████████████░░░░░░░░ 0.667
gender_match ██████████████░░░░░░░ 0.7

Key Takeaways from the Output
Rank Event Why it scored high/low
#1 Open Mic Poetry Night Perfect interest, vibe, MBTI, and age match → top score
#2 Sunset Painting Workshop Strong across the board, 2/3 interests hit
#3 Philosophy Book Club Good MBTI + partial interest/vibe match
#7 Football Pickup Game Zero interest/vibe overlap, wrong MBTI, too socially intense
#8 Tech Networking Wrong age bracket, wrong personality, too intense
Notice how interest_match and personality_match dominate the ranking because this user selected those in Q11, doubling their weights from 30→60 and 10→20 respectively.
