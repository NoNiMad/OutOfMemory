//#region Mission

const missionView = {
	tree: id("mission-file-tree"),
	path: id("mission-path"),
	stolen: id("stolen-files"),
	time: id("mission-time"),
	sizeValue: id("mission-space-value"),
	sizeProgress: id("mission-space-progress"),
	dlPopup: id("dl-popup"),
	dlFile: id("dl-file"),
	dlProgress: id("dl-progress"),
	dlLabel: id("dl-label"),
}
let currentMission = []

function unStealFile(node, stolenNodeLi)
{
	currentMission.stolenFiles.splice(currentMission.stolenFiles.indexOf(node), 1)
	currentMission.size.current -= node.size
	
	updateSize()
	missionView.stolen.removeChild(stolenNodeLi)
	currentMission.nodeIdToLi[node.id]?.classList.remove("disabled")
}

function stealFile(node)
{
	if (currentMission.dl.node !== undefined
		|| currentMission.stolenFiles.includes(node)
		|| currentMission.size.current + node.size > currentMission.size.total)
	{
		return
	}

	currentMission.dl = { node }
	missionView.dlPopup.style.display = "block"
	missionView.dlFile.innerText = node.name
	missionView.dlProgress.value = 0
}

function endDl()
{
	const node = currentMission.dl.node
	currentMission.stolenFiles.push(node)

	let compressedSize = node.size
	if (hasUpgrade(UpgradeID.COMP_TXT) && node.type === FileType.TEXT)
		compressedSize *= idToUpgrade[UpgradeID.COMP_TXT].value
	else if (hasUpgrade(UpgradeID.COMP_PIC) && node.type === FileType.PICTURE)
		compressedSize *= idToUpgrade[UpgradeID.COMP_PIC].value
	else if (hasUpgrade(UpgradeID.COMP_VID) && node.type === FileType.VIDEO)
		compressedSize *= idToUpgrade[UpgradeID.COMP_VID].value

	currentMission.size.current += compressedSize
	currentMission.nodeIdToLi[node.id].classList.add("disabled")

	updateSize()
	refreshStolen()
	cancelDl()
}

function cancelDl()
{
	currentMission.dl = {}
	missionView.dlPopup.style.display = "none"
}

function refreshStolen()
{
	missionView.stolen.innerText = ""

	currentMission.stolenFiles
		.sort((a, b) => a.size < b.size)
		.forEach(node => {
		const stolenNodeLi = el("li")
	
		const a = el("a")
		a.innerText = node.name + "\n- " + formatFileSize(node.size)
		a.onclick = () => unStealFile(node, stolenNodeLi)
		stolenNodeLi.append(a)

		missionView.stolen.append(stolenNodeLi)
	})
}

function onNodeClicked(node)
{
	if (node.children === undefined)
	{
		if (node.name === "..")
		{
			leaveNode()
		}
		else
		{
			stealFile(node)
		}
	}
	else
	{
		enterNode(node)
	}
}

function sumRecursively(node, valProvider)
{
	let sum = 0
	const val = valProvider(node)
	if (val !== undefined)
		sum += val
	if (node.children)
		node.children.forEach(c => sum += sumRecursively(c, valProvider))
	return sum
}

function createNode(node)
{
	const nodeLi = el("li")
	
	let nameContainer = el("a")
	nameContainer.setAttribute("href", "#")
	nameContainer.onclick = function() { onNodeClicked(node) }
	nameContainer.innerText = node.name === undefined ? "/" : node.name

	if (node.type === FileType.PROTECTED)
	{
		nameContainer.innerText += " ⚿"
		if (!hasUpgrade(UpgradeID.SCR_HACK_BRUTE) && !hasUpgrade(UpgradeID.SCR_HACK_RAINBOW))
		{
			nameContainer.classList.add("danger")
			nameContainer.onclick = null
		}
	}

	const rightContainer = document.createElement("span")
	rightContainer.classList.add("li-right")

	if (node.value !== undefined || (hasUpgrade(UpgradeID.ANA_VAL_FOLDER) && node.name !== ".."))
	{
		const value = sumRecursively(node, n => n.value)
		const hintSpan = el("span")
		hintSpan.classList.add("file-hint")
		if (hasUpgrade(UpgradeID.ANA_VAL_EXACT))
		{
			hintSpan.innerText = `${value.toFixed(2)}€`
		}
		else if (hasUpgrade(UpgradeID.ANA_VAL_ORDER))
		{
			const unit = Math.min(Math.floor(Math.log10(value) / 3), 4)
			hintSpan.innerText = ["€", "k€", "M€", "B€"][unit]
		}
		else if (hasUpgrade(UpgradeID.ANA_VAL_HINT))
		{
			const valPercentage = Math.floor((value - currentMission.hint.min) / currentMission.hint.range * 100)
			if (valPercentage > 66)
				hintSpan.innerText = "★★★"
			else if (valPercentage > 33)
				hintSpan.innerText = "★★"
			else
				hintSpan.innerText = "★"
		}
		rightContainer.append(hintSpan)
	}

	if (node.size !== undefined || (hasUpgrade(UpgradeID.ANA_FOLDER_SIZE) && node.name !== ".."))
	{
		const sizeSpan = el("span")
		sizeSpan.classList.add("size-span")
		if (node.size > getMaxStorageUpgrade().value)
		{
			sizeSpan.classList.add("danger")
		}

		sizeSpan.innerText = `${formatFileSize(sumRecursively(node, n => n.size))}`
		rightContainer.append(sizeSpan)
	}
	nameContainer.append(rightContainer)

	const clearSpan = document.createElement("div")
	clearSpan.classList.add("clear")
	nameContainer.append(clearSpan)

	if (node.children !== undefined)
	{
		nodeLi.classList.add("has-children")
		// TODO: Disable is fully stolen
	}
	else if (currentMission.stolenFiles.includes(node))
	{
		nodeLi.classList.add("disabled")
	}

	nodeLi.append(nameContainer)

	return nodeLi
}

function nodeSorter(a, b)
{
	const hasSortBySize = hasUpgrade(UpgradeID.ANA_SORT_SIZE)
	if (a.children && b.children)
	{
		if (hasSortBySize && hasUpgrade(UpgradeID.ANA_FOLDER_SIZE))
		{
			return sumRecursively(a, n => n.size) < sumRecursively(b, n => n.size)
		}
		return a.name > b.name
	}

	if (a.children && !b.children)
		return -1

	if (!a.children && b.children)
		return 1
	
	if (hasSortBySize)
	{
		return a.size < b.size
	}
	return a.name > b.name
}

function enterNode(node)
{
	currentMission.nodeStack.push(node)
	currentMission.nodeIdToLi = {}
	updateRemotePath()

	missionView.tree.innerText = ""
	
	// To be able to leave the node
	if (currentMission.nodeStack.length > 1)
	{
		const goUpNode = createNode({ name: ".." })
		goUpNode.classList.add("has-children")
		missionView.tree.append(goUpNode)
	}
	
	for (let child of node.children.sort(nodeSorter))
	{
		const childLi = createNode(child)
		currentMission.nodeIdToLi[child.id] = childLi
		missionView.tree.append(childLi)
	}
}

function leaveNode()
{
	currentMission.nodeStack.pop()
	enterNode(currentMission.nodeStack.pop())
}

function updateRemotePath()
{
	let path = ""
	for (let node of currentMission.nodeStack)
	{
		path += `${node.name ?? ""}/`
	}

	missionView.path.innerText = path
}

function updateSize()
{
	missionView.sizeValue.innerText = `${formatFileSize(currentMission.size.current)} / ${formatFileSize(currentMission.size.total)}`
	
	let percentage = 0
	if (currentMission.size.total !== 0)
	{
		percentage = currentMission.size.current / currentMission.size.total * 100
	}
	currentMission.size.percentage = percentage
	missionView.sizeProgress.value = percentage

	if (percentage > 90)
	{
		missionView.sizeProgress.className = "full"
	}
	else if (percentage > 70)
	{
		missionView.sizeProgress.className = "warning"
	}
	else
	{
		missionView.sizeProgress.className = ""
	}
}

function parseTree(node, childrenProvider, action)
{
	action(node)
	const children = childrenProvider(node)
	if (Array.isArray(children))
		children.forEach(c => parseTree(c, childrenProvider, action))
}

function startMission()
{
	debriefList.innerText = ""
	currentMission = {
		remoteFiles: { children: generateFileTree() },
		stolenFiles: [],
		nodeStack: [],
		nodeIdToLi: {},
		time: {
			available: 2 * 60 * 1000,
			start: null
		},
		size: {
			total: getMaxStorageUpgrade().value,
			current: 0,
			percentage: 0
		},
		dl: {},
		animationFrameId: requestAnimationFrame(updateMission)
	}

	missionView.stolen.innerText = ""
	updateSize()

	if (hasUpgrade(UpgradeID.ANA_VAL_HINT))
	{
		currentMission.hint = { min: Infinity, max: -Infinity }
		parseTree(currentMission.remoteFiles, n => n.children, n => {
			if (n.value !== undefined)
			{
				currentMission.hint.min = Math.min(currentMission.hint.min, n.value)
				currentMission.hint.max = Math.max(currentMission.hint.max, n.value)
			}
		})
		currentMission.hint.range = currentMission.hint.max - currentMission.hint.min
	}

	enterNode(currentMission.remoteFiles)
	setPanel(Panels.MISSION)
}

function updateMission(timestamp)
{
	if (currentMission.time === undefined)
		return

	// Time
	if (currentMission.time.start === null)
	{
		currentMission.time.start = timestamp
	}

	if (timestamp > currentMission.time.start + currentMission.time.available)
	{
		endMission(false)
		return
	}

	const secondsLeft = Math.floor((currentMission.time.start + currentMission.time.available - timestamp) / 1000)
	const minutes = Math.floor(secondsLeft / 60)
	const seconds = secondsLeft % 60
	missionView.time.innerText = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
	
	// Dl
	if (currentMission.dl.node !== undefined)
	{
		if (currentMission.dl.start === undefined)
		{
			currentMission.dl.start = timestamp
			currentMission.dl.phase = "dl"
			missionView.dlLabel.innerText = "Downloading"
		}
		else
		{
			if (currentMission.dl.phase === "dl")
			{
				const sizeDownloaded = (timestamp - currentMission.dl.start) / 1000 * getMaxInternetUpgrade().value
				const percentage = sizeDownloaded / currentMission.dl.node.size * 100
	
				if (percentage >= 100)
				{
					if (currentMission.dl.node.type === FileType.PROTECTED)
					{
						currentMission.dl.start = timestamp
						currentMission.dl.phase = "decrypt"
						missionView.dlLabel.innerText = "Decrypting"
					}
					else
					{
						endDl()
					}
				}
				else
				{
					missionView.dlProgress.value = percentage
				}
			}
			else
			{
				const decrypSecondPerGo = hasUpgrade(UpgradeID.SCR_HACK_RAINBOW) ? fileSize(50, SizeUnit.GO) : fileSize(1, SizeUnit.KO)
				const sizeDecrypted = (timestamp - currentMission.dl.start) / 1000 * decrypSecondPerGo
				const percentage = sizeDecrypted / currentMission.dl.node.size * 100

				if (percentage >= 100)
				{
					endDl()
				}
				else
				{
					missionView.dlProgress.value = percentage
				}
			}
		}
	}

	currentMission.animationFrameId = requestAnimationFrame(updateMission)
}

function endMission(win)
{
	win = win !== false
	const filesCount = currentMission.stolenFiles.length

	addDebriefLine(`Number of files stolen: ${filesCount}`)
	addDebriefLine(`Storage status: ${formatFileSize(currentMission.size.current)} / ${formatFileSize(currentMission.size.total)} - ${currentMission.size.percentage.toFixed(2)}% filled`)
	addDebriefLine("<hr>")

	let earnedMoney = 0
	for (const node of currentMission.stolenFiles)
	{
		earnedMoney += node.value
	}
	addDebriefLine(`&nbsp;&nbsp;${earnedMoney.toFixed(2)}€ - Total value of all files`)

	let modifier = 0
	if (currentMission.size.percentage > 90)
	{
		modifier += 0.2
		addDebriefLine("+ 20% - Storage filled more than 90%")
	}
	else if (currentMission.size.percentage > 70)
	{
		modifier += 0.1
		addDebriefLine("+ 10% - Storage filled more than 70%")
	}

	if (!win)
	{
		modifier -= 0.7
		addDebriefLine("- 90% - Busted by HADOPI", ["danger"])
	}

	const modifiedEarned = earnedMoney * (1 + modifier)
	state.money += modifiedEarned
	addDebriefLine(`= ${modifiedEarned.toFixed(2)}€`)

	addDebriefLine("<hr>")
	addDebriefLine("File details:")
	currentMission.stolenFiles
		.sort((a, b) => a.value < b.value)
		.forEach(file => addDebriefLine(`- ${file.name} - ${file.value.toFixed(2)}€`))

	addToStat(win ? Stats.MISSION_WINS : Stats.MISSION_FAILS, 1)
	addToStat(Stats.FILES_STOLEN, filesCount)
	addToStat(Stats.SIZE_DL, currentMission.size.current)
	addToStat(Stats.TOTAL_MONEY, modifiedEarned)
	
	const missionsCount = getStat(Stats.MISSION_WINS) + getStat(Stats.MISSION_FAILS)
	const newSum = currentMission.size.percentage + getStat(Stats.AVERAGE_RATIO) * (missionsCount - 1)
	setStat(Stats.AVERAGE_RATIO, newSum / missionsCount)

	cancelAnimationFrame(currentMission.animationFrameId)
	const shouldShowDebrief = filesCount > 0
	currentMission = {}
	save()
	setPanel(shouldShowDebrief ? Panels.DEBRIEF : Panels.HOME)
}

//#endregion

//#region Debrief

const debriefList = id("debrief-list")

function addDebriefLine(text, classes)
{
	const li = el("li")
	li.innerHTML = text
	if (classes)
		li.classList.add(...classes)
	debriefList.append(li)
}

//#endregion

//#region Home

const homeView =
{
	upgrades: id("home-upgrades")
}

function upgradeSorter(a, b)
{
	if (a.type === b.type)
	{
		if (a.value && b.value)
		{
			return a.value > b.value
		}
		return a.name > b.name
	}
	return a.type > b.type
}

function onHomePanel()
{
	updateMoney()

	homeView.upgrades.innerText = ""
	let prevUpgradeType
	for (const u of state.upgrades.map(id => idToUpgrade[id]).sort(upgradeSorter))
	{
		if (prevUpgradeType !== u.type)
		{
			const typeName = humanize(Object.keys(UpgradeType)[u.type])
			loadUpgrade({ name: `- ${typeName}` }, homeView.upgrades, false)
			prevUpgradeType = u.type
		}
		loadUpgrade(u, homeView.upgrades, false)
	}
}

//#endregion

//#region Stats

const statsList = id("stats-list")

function onStatsPanel()
{
	statsList.innerText = ""
	for (const name in state.stats)
	{
		const statLi = el("li")
		const value = state.stats[name]
		let text = value
		switch (Stats[name])
		{
			case Stats.AVERAGE_RATIO:
				text = `${value.toFixed(2)}%`
				break
			case Stats.TOTAL_MONEY:
				text = `${value.toFixed(2)}€`
				break
			case Stats.SIZE_DL:
				text = formatFileSize(value)
				break
		}
		statLi.innerText = `${Stats[name]}: ${text}`
		statsList.append(statLi)
	}
}

function getStatKey(label)
{
	return Object.keys(Stats)[Object.values(Stats).indexOf(label)]
}

function addToStat(stat, value)
{
	state.stats[getStatKey(stat)] += value
}

function setStat(stat, value)
{
	state.stats[getStatKey(stat)] = value
}

function getStat(stat)
{
	return state.stats[getStatKey(stat)]
}

function initStats()
{
	for (const name in Stats)
	{
		if (state.stats[name] === undefined)
		{
			state.stats[name] = 0
		}
	}
}

//#endregion

//#region Shop

const shopView =
{
	firstLoad: true,
	shopRoot: id("shop-root"),
	bought: id("upgrades-bought")
}

function buyUpgrade(upgrade, li)
{
	if (hasUpgrade(upgrade.id))
		return

	state.upgrades.push(upgrade.id)
	state.money -= upgrade.cost
	updateMoney()
	save()
	refreshShop()
}

function loadUpgrade(upgrade, ul, buyable)
{
	const li = el("li")
	const alreadyHaveUpgrade = hasUpgrade(upgrade.id)

	let nameContainer
	let displayedName = upgrade.name
	if (!buyable || upgrade.cost === undefined)
	{
		nameContainer = el("div")
		nameContainer.innerText = displayedName
	}
	else
	{
		nameContainer = el("a")
		nameContainer.href = "#"
		nameContainer.innerText = displayedName

		if (alreadyHaveUpgrade)
		{
			li.classList.add("disabled")
		}
		else if (upgrade.cost > state.money)
		{
			nameContainer.classList.add("danger")
		}
		else
		{
			li.onclick = () => buyUpgrade(upgrade, li)
		}

		const priceTag = el("span")
		priceTag.classList.add("li-right")
		priceTag.innerText = `${upgrade.cost} €`
		nameContainer.append(priceTag)
	}

	if (upgrade.desc || upgrade.value)
	{
		const tooltip = el("span")
		tooltip.classList.add("tooltip")
		let text = upgrade.desc
		switch (upgrade.type)
		{
			case UpgradeType.STORAGE:
				text = formatFileSize(upgrade.value)
				break
			case UpgradeType.CONNECTION:
				text = formatFileSize(upgrade.value) + "/s"
				break
		}
		tooltip.innerText = text
		
		nameContainer.append(tooltip)
	}

	li.append(nameContainer)

	if (upgrade.children !== undefined)
	{
		const subUl = el("ul")
		upgrade.children.forEach(child => loadUpgrade(child, subUl, buyable))
		li.append(subUl)

		li.classList.add("is-opened")
	}

	ul.append(li)
}

function refreshShop()
{
	shopView.shopRoot.innerText = ""
	Upgrades.forEach(u => loadUpgrade(u, shopView.shopRoot, true))
}

function onShopPanel()
{
	updateMoney()
	refreshShop()
}

//#endregion

//#region Shared

function updateMoney()
{
	for (const moneyEl of document.getElementsByClassName("money"))
	{
		moneyEl.innerText = state.money.toFixed(2)
	}
}

//#endregion

//#region State

let state

function getMaxStorageUpgrade()
{
	const storageUpgrades = state.upgrades.map(id => idToUpgrade[id]).filter(u => u.type === UpgradeType.STORAGE)
	return storageUpgrades.reduce((prev, curr) => curr.value > prev.value ? curr : prev)
}

function getMaxInternetUpgrade()
{
	const connUpgrades = state.upgrades.map(id => idToUpgrade[id]).filter(u => u.type === UpgradeType.CONNECTION)
	return connUpgrades.reduce((prev, curr) => curr.value > prev.value ? curr : prev)
}

function hasUpgrade(upgradeId)
{
	return state.upgrades.includes(upgradeId)
}

const idToUpgrade = {}
function initUpgrades()
{
	Upgrades.forEach(cache)
	function cache(upgrade)
	{
		if (upgrade.id !== undefined)
			idToUpgrade[upgrade.id] = upgrade
		if (upgrade.children)
			upgrade.children.forEach(cache)
	}
}

//#endregion

//#region Save

function load()
{
	let loadedSave = localStorage.getItem(LocalStorageKey)
	if (loadedSave === null)
	{
		state = {
			money: 0,
			upgrades: [ UpgradeID.STO_FLOPPY, UpgradeID.CON_MODEM ],
			stats: {}
		}
	}
	else
	{
		try
		{
			state = JSON.parse(atob(loadedSave))
		}
		catch (e)
		{
			alert("Your save is corrupted or invalid. It is going to be reset.")
			loadedSave = null
			localStorage.removeItem(LocalStorageKey)
			state = {
				money: 0,
				upgrades: [ UpgradeID.STO_FLOPPY, UpgradeID.CON_MODEM ],
				stats: {}
			}
		}
	}
	initStats()
	initUpgrades()
	return loadedSave !== null
}

function save()
{
	localStorage.setItem(LocalStorageKey, btoa(JSON.stringify(state)))
}

function exportSave()
{
	const value = localStorage.getItem(LocalStorageKey)
	if (value === null)
	{
		alert("No save... yet!")
	}
	else
	{
		alert("Here is your save. Copy the whole string to import later or to backup.\n\n" + btoa(value))
	}
}

function importSave()
{
	const value = prompt("Enter your save string here. This will overwrite your current save!\nProceed with caution.")
	if (value !== null)
	{
		try
		{
			localStorage.setItem(LocalStorageKey, atob(value))
			location.reload()
		}
		catch(e)
		{
			alert("The save you provided could not be decoded. Are you sure it is valid?")
		}
	}
}

function clearSave()
{
	if (confirm("You will not be able to undo this. Are you sure you want to continue?"))
	{
		localStorage.removeItem(LocalStorageKey)
		location.reload()
	}
}

//#endregion

//#region Panels and auto-links

function setupLinks()
{
	const panelLinks = document.querySelectorAll("a[data-target-panel]")
	panelLinks.forEach(link => {
		const target = link.getAttribute("data-target-panel")
		link.onclick = () => {
			setPanel(Panels[target])
		}
	})

	const executeLinks = document.querySelectorAll("a[data-execute]")
	executeLinks.forEach(link => {
		const target = link.getAttribute("data-execute")
		const targetFunction = window[target]
		if (typeof(targetFunction) === "function")
		{
			link.onclick = targetFunction
		}
		else
		{
			console.error("Invalid data-execute target: " + target)
		}
	})
}

let currentPanel = ""

function setPanel(panelId)
{
	currentPanel = panelId

	const panels = document.querySelectorAll(".panel")
	panels.forEach(panel => {
		if (panel.id === panelId)
		{
			panel.style.display = "flex"
		}
		else
		{
			panel.style.display = "none"
		}
	})

	const onSetPanelFunction = window[`on${humanize(panelId)}Panel`]
	if (typeof(onSetPanelFunction) === "function")
	{
		onSetPanelFunction()
	}
}

//#endregion

;(function() {
	const saveFound = load()
	setupLinks()
	setPanel(saveFound ? Panels.HOME : Panels.MENU)
})()