const LocalStorageKey = "out_of_memory"

const ThemeList = {
	"dark-green-theme": "Dark green",
	"light-theme": "Light (don't do this to yourself)"
}

const DefaultTheme = "dark-green-theme"

const Panels = {
	MENU: "menu",
	HOME: "home",
	SHOP: "shop",
	MISSION: "mission",
	STATS: "stats",
	DEBRIEF: "debrief",
	STORY: "story",
	THEME: "theme"
}

const Stats = {
	MISSION_WINS: "Missions completed",
	MISSION_FAILS: "Missions failed",
	FILES_STOLEN: "Files stolen",
	SIZE_DL: "Total size downloaded",
	AVERAGE_RATIO: "Average storage filled",
	TOTAL_MONEY: "Total money earned"
}

const FileNames =
{
	location:
	[
		"my bedroom",
		"my kitchen",
		"my house",
		"my bathroom",
		"the street",
		"the supermarket",
		"the school",
		"the classroom",
		"the bus",
		"the train",
		"the car"
	],
	person:
	[
		"me",
		"my mother",
		"my father",
		"my daughter",
		"my sister",
		"my son",
		"my brother",
		"my grandma",
		"my grandpa",
		"my uncle",
		"my aunt",
		"my best friend",
		"my SO",
		"my cat",
		"my dog",
		"a friend",
		"Mickael",
		"Jack",
		"Lewis",
		"John",
		"Sam",
		"Anne",
		"Laura",
		"Alice",
		"Marina"
	],
	object:
	[
		"my computer",
		"my keyboard",
		"my kettle",
		"my fork",
		"my sink",
		"my desk",
		"my table",
		"my chair",
		"my bed",
		"my dress",
		"my shirt",
		"my cap",
		"my jacket",
		"an apple",
		"pasta",
		"chocolate",
		"a strawberry",
		"a burger",
		"french fries",
		"lasagna",
		"pizza",
		"salad",
		"a cake",
		"a candy",
		"water",
		"wine",
		"soda",
		"coffee",
		"tea"
	],
	animal:
	[
		"a cat",
		"a dog",
		"a snake",
		"a bird",
		"a butterfly",
		"a horse",
		"a monkey",
		"a dolphin",
		"a tiger",
		"a lion",
		"a bear",
		"an elephant",
		"a wolf",
		"a dear",
		"a spider",
		"a fly",
		"a rat",
		"a mouse"
	],
	living:
	[
		"%person",
		"%animal"
	],
	subject:
	[
		"%person",
		"%object",
		"%animal"
	],
	document:
	[
		"passwords",
		"id card",
		"schedule",
		"[person]'s bank statement",
		"my bank statement",
		"[person]'s bank details",
		"my bank details",
		"mail",
		"vacation",
		"my transcript",
		"[person]'s transcript",
		"shopping list",
		"contacts",
		"[object] invoice",
	],
	folder:
	[
		"paperwork",
		"images",
		"videos",
		"documents",
		"private",
		"temp",
		"recycle bin",
		"desktop",
		"important",
		"work",
		"urgent",
		"backup"
	],
	action:
	[
		"singing",
		"skiing",
		"biking",
		"driving",
		"playing",
		"flying",
		"running",
		"talking",
		"walking",
		"dancing",
		"eating [subject]",
		"drinking [object]",
		"sleeping",
		"working",
		"smashing [object]",
		"building [object]"
	],
	sentence:
	[
		"[living] [action]",
		"[living] [action] in [location]",
		"[living] and [living] [action]",
	],
	work:
	[
		"tutorial for [person]",
		"building [location]",
		"contracts",
		"accounting 101"
	],
	code:
	[
		"index",
		"app",
		"simple_script",
		"ui",
		"test",
		"printer",
		"save",
		"server"
	],
	critical:
	[
		"backups",
		"[person]_backup_full",
		"company_full",
		"it_do_not_leak",
		"StateFiles_SECRET",
		"xxx"
	]
}