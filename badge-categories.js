// 22 CATEGORY ARRAYS — 25 BADGES EACH

const HYDRATION_BADGES = [
  "Aqua Starter","Sip Scholar","Hydration Hero","Water Whisperer","Crystal Clear",
  "Ocean Drop","Liquid Legend","Wave Rider","Deep Blue","Pure Flow",
  "Hydro Master","Thirst Crusher","Ripple Maker","Fresh Fountain","Blue Surge",
  "Water Warrior","Aqua Guardian","Hydration Machine","Daily Drinker","Overflow",
  "Streamline","Aqua Elite","Waterfall","Hydro Champion","Liquid Loyalty"
];

const SLEEP_BADGES = [
  "Dream Starter","Cozy Cloud","Night Owl","Deep Sleeper","REM Royalty",
  "Pillow Prince/Princess","Midnight Calm","Rested Soul","Sleep Sage","Dream Diver",
  "Night Guardian","Snooze Scholar","Lunar Rest","Star Sleeper","Moonlit Mind",
  "Quiet Hours","Dream Weaver","Sleep Master","Night Nirvana","Peaceful Pillow",
  "Slumber Spirit","Dream Elite","Nighttime Noble","REM Runner","Sleep Champion"
];

const WORKOUT_BADGES = [
  "Fitness Rookie","Iron Starter","Sweat Spark","Gym Guardian","Power Pulse",
  "Strength Seeker","Cardio Crusher","Flex Fighter","Endurance Engine","Motion Master",
  "Fit Flow","Peak Performer","Lift Legend","Sweat Storm","Body Boost",
  "Power Surge","Workout Warrior","Fit Elite","Iron Icon","Cardio King/Queen",
  "Strength Supreme","Motion Monarch","Fitness Champion","Endurance Emperor","Gym Titan"
];

const NUTRITION_BADGES = [
  "Healthy Start","Clean Plate","Green Machine","Balanced Bite","Nutrition Ninja",
  "Fresh Fuel","Meal Master","Macro Minded","Fiber Force","Vitamin Voyager",
  "Clean Eater","Smart Snacker","Whole Food Warrior","Plate Perfection","Nourish Knight",
  "Healthy Hero","Fresh Feast","Nutrition Noble","Balanced Body","Fuel Flow",
  "Macro Master","Clean Champion","Healthy Elite","Nourish Emperor","Food Flow"
];

const STREAK_BADGES = [
  "Day One","Consistency Starter","3‑Day Spark","7‑Day Flame","10‑Day Flow",
  "14‑Day Rhythm","21‑Day Habit","30‑Day Warrior","50‑Day Elite","75‑Day Titan",
  "100‑Day Legend","150‑Day Master","200‑Day Guardian","250‑Day Noble","300‑Day Emperor",
  "365‑Day Champion","Half‑Year Hero","Daily Devoted","Habit Keeper","Rhythm Rider",
  "Streak Surfer","Consistency King/Queen","Flow Keeper","Eternal Streak","Unbroken"
];

const LEVEL_BADGES = [
  "Level 1 Initiate","Level 2 Explorer","Level 3 Adept","Level 4 Challenger","Level 5 Warrior",
  "Level 6 Guardian","Level 7 Noble","Level 8 Elite","Level 9 Master","Level 10 Champion",
  "Level 11 Titan","Level 12 Emperor","Level 13 Ascendant","Level 14 Apex","Level 15 Supreme",
  "Level 16 Mythic","Level 17 Eternal","Level 18 Infinite","Level 19 Radiant","Level 20 Celestial",
  "Level 21 Stellar","Level 22 Cosmic","Level 23 Astral","Level 24 Divine","Level 25 Transcendent"
];

const MINDFULNESS_BADGES = [
  "Calm Starter","Breath Beginner","Zen Seeker","Mindful Moment","Peace Pulse",
  "Stillness Sage","Focus Flow","Quiet Mind","Inner Light","Calm Guardian",
  "Zen Master","Peaceful Presence","Mindful Monarch","Serenity Spirit","Breath Warrior",
  "Tranquil Titan","Inner Balance","Soulful Silence","Peace Elite","Mindful Champion",
  "Calm Emperor","Zen Elite","Stillness Supreme","Serenity Seeker","Mind Master"
];

const JOURNAL_BADGES = [
  "First Entry","Thought Starter","Reflection Rookie","Page Turner","Insight Initiate",
  "Mind Writer","Daily Scribe","Story Weaver","Journal Guardian","Reflection Master",
  "Insight Elite","Page Champion","Thought Titan","Mind Monarch","Deep Writer",
  "Soul Scribe","Entry Emperor","Reflection Royalty","Journal Legend","Insight Icon",
  "Page Pro","Thought Keeper","Mindful Writer","Daily Documenter","Journal Champion"
];

const BLOG_BADGES = [
  "First Comment","Blog Reader","Insight Sharer","Community Voice","Thoughtful Commenter",
  "Blog Explorer","Post Supporter","Discussion Starter","Comment Contributor","Blog Guardian",
  "Insight Master","Community Elite","Thought Titan","Blog Champion","Comment King/Queen",
  "Discussion Noble","Insight Emperor","Blog Loyalist","Post Partner","Community Spirit",
  "Blog Flow","Comment Master","Insight Icon","Blog Legend","Community Champion"
];

const SHOP_BADGES = [
  "First Purchase","Shop Explorer","Item Collector","FitFlow Shopper","Reward Redeemer",
  "Coin Keeper","Shop Guardian","Item Hunter","Purchase Pro","Shop Master",
  "Reward Royalty","Collector Elite","Shop Titan","Item Emperor","Reward Champion",
  "Shop Noble","Coin Conqueror","Purchase Prince/Princess","Item Icon","Shop Legend",
  "Reward Master","Collector Supreme","Shop Emperor","Item Elite","Reward Titan"
];

const CHALLENGE_BADGES = [
  "Challenge Starter","First Challenge","Bronze Challenger","Silver Challenger","Gold Challenger",
  "Challenge Warrior","Challenge Guardian","Challenge Master","Challenge Elite","Challenge Titan",
  "Challenge Emperor","Weekly Winner","Monthly Master","Challenge Champion","Task Taker",
  "Goal Getter","Mission Maker","Challenge Crusher","Quest Keeper","Challenge Noble",
  "Challenge Icon","Challenge Legend","Quest Champion","Task Titan","Mission Monarch"
];

const STEP_BADGES = [
  "Step Starter","1k Walker","2k Walker","5k Walker","10k Walker",
  "Step Warrior","Step Guardian","Step Master","Step Elite","Step Titan",
  "Step Emperor","Movement Maker","Pace Pro","Walk Warrior","Motion Monarch",
  "Step Champion","Pace Prince/Princess","Trail Treader","Path Pioneer","Walk Legend",
  "Step Icon","Pace Elite","Motion Master","Trail Titan","Step Supreme"
];

const WEIGHT_BADGES = [
  "Goal Starter","First Milestone","Progress Maker","Weight Warrior","Scale Guardian",
  "Goal Crusher","Progress Pro","Weight Winner","Goal Master","Progress Elite",
  "Weight Titan","Goal Emperor","Progress Champion","Weight Noble","Goal Icon",
  "Progress Legend","Weight Supreme","Goal Keeper","Progress Prince/Princess","Weight Monarch",
  "Goal Titan","Progress Emperor","Weight Elite","Goal Legend","Progress Champion"
];

const CONSISTENCY_BADGES = [
  "Routine Rookie","Habit Starter","Daily Doer","Consistency Keeper","Routine Rider",
  "Habit Hero","Daily Devoted","Consistency Champion","Routine Master","Habit Elite",
  "Daily Titan","Consistency Emperor","Routine Noble","Habit Icon","Daily Legend",
  "Consistency Supreme","Routine Guardian","Habit Warrior","Daily Monarch","Consistency Titan",
  "Routine Emperor","Habit Champion","Daily Elite","Consistency Icon","Routine Legend"
];

const MOTIVATION_BADGES = [
  "Spark Starter","Motivation Maker","Drive Developer","Energy Elite","Momentum Master",
  "Motivation Warrior","Drive Guardian","Energy Titan","Momentum Monarch","Motivation Champion",
  "Drive Emperor","Energy Icon","Momentum Legend","Motivation Noble","Drive Supreme",
  "Energy Keeper","Momentum Elite","Motivation Titan","Drive Legend","Energy Emperor",
  "Momentum Champion","Motivation Icon","Drive Master","Energy Noble","Momentum Supreme"
];

const TIME_BADGES = [
  "Early Bird","Night Grinder","Morning Warrior","Afternoon Achiever","Evening Elite",
  "Midnight Master","Sunrise Starter","Sunset Seeker","Time Keeper","Daily Timer",
  "Hour Hero","Time Titan","Clock Champion","Routine Rhythm","Time Guardian",
  "Day Dominator","Night Noble","Time Icon","Hour Emperor","Day Legend",
  "Time Supreme","Rhythm Rider","Time Elite","Hour Master","Day Titan"
];

const EVENT_BADGES = [
  "New Year Starter","Summer Shred","Winter Warrior","Spring Starter","Autumn Achiever",
  "Holiday Hero","Celebration Champion","Event Elite","Seasonal Supreme","Festival Fitness",
  "Challenge Season","Anniversary Achiever","Birthday Badge","Milestone Moment","Seasonal Spirit",
  "Event Emperor","Holiday Noble","Festival Titan","Celebration Icon","Seasonal Legend",
  "Event Master","Holiday Champion","Festival Elite","Celebration Supreme","Seasonal Monarch"
];

const MINDSET_BADGES = [
  "Growth Starter","Positive Pulse","Mindset Maker","Confidence Keeper","Focus Fighter",
  "Growth Guardian","Positive Pro","Mindset Master","Confidence Champion","Focus Elite",
  "Growth Titan","Positive Emperor","Mindset Icon","Confidence Legend","Focus Supreme",
  "Growth Noble","Positive Warrior","Mindset Monarch","Confidence Elite","Focus Titan",
  "Growth Champion","Positive Icon","Mindset Supreme","Confidence Emperor","Focus Legend"
];

const COMMUNITY_BADGES = [
  "Community Starter","Supportive Soul","Encouragement Elite","Team Player","Community Guardian",
  "Support Master","Encouragement Champion","Team Titan","Community Noble","Support Icon",
  "Encouragement Legend","Team Supreme","Community Warrior","Support Elite","Encouragement Emperor",
  "Team Monarch","Community Champion","Support Titan","Encouragement Icon","Team Legend",
  "Community Supreme","Support Noble","Encouragement Master","Team Elite","Community Icon"
];

const MILESTONE_BADGES = [
  "First Win","Small Victory","Big Victory","Major Milestone","Achievement Maker",
  "Goal Getter","Milestone Master","Achievement Elite","Goal Champion","Milestone Titan",
  "Achievement Emperor","Goal Icon","Milestone Legend","Achievement Supreme","Goal Noble",
  "Milestone Guardian","Achievement Warrior","Goal Elite","Milestone Monarch","Achievement Titan",
  "Goal Supreme","Milestone Icon","Achievement Legend","Goal Master","Milestone Champion"
];

const RARE_BADGES = [
  "Diamond Flow","Platinum Pulse","Golden Guardian","Sapphire Spirit","Ruby Rhythm",
  "Emerald Elite","Crystal Champion","Obsidian Titan","Pearl Noble","Amethyst Icon",
  "Quartz Master","Topaz Legend","Jade Emperor","Onyx Supreme","Moonstone Monarch",
  "Sunstone Spirit","Meteor Elite","Galaxy Guardian","Cosmic Champion","Stellar Titan",
  "Nebula Noble","Aurora Icon","Eclipse Master","Radiant Legend","Celestial Supreme"
];

const FUN_BADGES = [
  "Chill Vibes","Energy Burst","Soft Mode","Hard Mode","Cozy Warrior",
  "Sunshine Soul","Moonlight Mind","Star Spirit","Rainbow Runner","Cloud Walker",
  "Fire Starter","Ice Breaker","Earth Keeper","Air Dancer","Cosmic Dreamer",
  "Neon Pulse","Retro Rhythm","Pixel Power","Pastel Prince/Princess","Vibe Master",
  "Mood Maker","Flow Finder","Spark Seeker","Aura Elite","Vibe Legend"
];
