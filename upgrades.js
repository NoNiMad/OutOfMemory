const Upgrades =
[
	{
		name: "Storage",
		desc: "Increases the maximum of files that you can steal",
		children:
		[
			{
				id: UpgradeID.STO_FLOPPY,
				name: "Floppy disk",
				cost: 0,
				type: UpgradeType.STORAGE,
				value: fileSize(80, SizeUnit.KO)
			},
			{
				id: UpgradeID.STO_SD,
				name: "SD Card",
				cost: 100,
				type: UpgradeType.STORAGE,
				value: fileSize(1, SizeUnit.MO)
			},
			{
				id: UpgradeID.STO_CD,
				name: "CD",
				cost: 1000,
				type: UpgradeType.STORAGE,
				value: fileSize(700, SizeUnit.MO)
			},
			{
				id: UpgradeID.STO_DVD,
				name: "DVD",
				cost: 10000,
				type: UpgradeType.STORAGE,
				value: fileSize(1.46, SizeUnit.GO)
			},
			{
				id: UpgradeID.STO_USB,
				name: "USB Key",
				cost: 100000,
				type: UpgradeType.STORAGE,
				value: fileSize(8, SizeUnit.GO)
			},
			{
				id: UpgradeID.STO_HDD,
				name: "HDD",
				cost: 1000000,
				type: UpgradeType.STORAGE,
				value: fileSize(128, SizeUnit.GO)
			},
			{
				id: UpgradeID.STO_SSD,
				name: "SSD",
				cost: 5000000,
				type: UpgradeType.STORAGE,
				value: fileSize(512, SizeUnit.GO)
			},
			{
				id: UpgradeID.STO_NAS,
				name: "NAS",
				cost: 10000000,
				type: UpgradeType.STORAGE,
				value: fileSize(4, SizeUnit.TO)
			}
		]
	},
	{
		name: "Connection",
		desc: "Speed up the file transfer",
		children:
		[
			{
				id: UpgradeID.CON_MODEM,
				name: "Modem 56k",
				cost: 0,
				type: UpgradeType.CONNECTION,
				value: fileSize(56, SizeUnit.KO)
			},
			{
				id: UpgradeID.CON_ADSL,
				name: "ADSL",
				cost: 2000,
				type: UpgradeType.CONNECTION,
				value: fileSize(1, SizeUnit.MO)
			},
			{
				id: UpgradeID.CON_VDSL,
				name: "VDSL",
				cost: 20000,
				type: UpgradeType.CONNECTION,
				value: fileSize(100, SizeUnit.MO)
			},
			{
				id: UpgradeID.CON_FIBER,
				name: "Optic Fiber",
				cost: 200000,
				type: UpgradeType.CONNECTION,
				value: fileSize(1, SizeUnit.GO)
			},
			{
				id: UpgradeID.CON_QUANTIC,
				name: "Quantic Entanglement",
				cost: 2000000,
				type: UpgradeType.CONNECTION,
				value: fileSize(100, SizeUnit.GO)
			}
		]
	},
	{
		name: "Compression",
		desc: "Reduce the size of a file after downloading",
		children:
		[
			{
				id: UpgradeID.COMP_TXT,
				name: "Text",
				desc: "Compress text files by 30% while downloading",
				cost: 5000,
				type: UpgradeType.COMPRESSION,
				value: 0.7
			},
			{
				id: UpgradeID.COMP_PIC,
				name: "Picture",
				desc: "Compress pictures by 20% while downloading",
				cost: 5000,
				type: UpgradeType.COMPRESSION,
				value: 0.8
			},
			{
				id: UpgradeID.COMP_VID,
				name: "Video",
				desc: "Compress videos by 10% while downloading",
				cost: 5000,
				type: UpgradeType.COMPRESSION,
				value: 0.9
			}
		]
	},
	{
		name: "Analysis",
		children:
		[
			{
				id: UpgradeID.ANA_FOLDER_SIZE,
				name: "Folder size",
				desc: "Display the size of folders",
				cost: 5000,
				type: UpgradeType.ANALYSIS
			},
			{
				id: UpgradeID.ANA_SORT_SIZE,
				name: "Sort by size",
				desc: "Sort files by size",
				cost: 1000,
				type: UpgradeType.ANALYSIS
			},
			{
				name: "Value analyzer",
				desc: "Show information about the file's resell value",
				children:
				[
					{
						id: UpgradeID.ANA_VAL_HINT,
						name: "Value hint",
						desc: "Show a price rating from one to three stars, relative to the current mission",
						cost: 10000,
						type: UpgradeType.ANALYSIS
					},
					{
						id: UpgradeID.ANA_VAL_ORDER,
						name: "Order of magnitude",
						desc: "Show the order of magnitude of the file's price: €, k€, M€...",
						cost: 100000,
						type: UpgradeType.ANALYSIS
					},
					{
						id: UpgradeID.ANA_VAL_EXACT,
						name: "Exact price",
						desc: "Show the exact price of the file",
						cost: 1000000,
						type: UpgradeType.ANALYSIS
					},
					{
						id: UpgradeID.ANA_VAL_FOLDER,
						name: "Display on folders",
						desc: "Display the value on folders as well",
						cost: 100000,
						type: UpgradeType.ANALYSIS
					},
				]
			}
		]
	},
	{
		name: "Scripts",
		children:
		[
			{
				name: "AutoFileDecrypt.sh",
				desc: "Decrypts a protected file",
				children:
				[
					{
						id: UpgradeID.SCR_HACK_BRUTE,
						name: "Bruteforce",
						desc: "2 KO/s",
						cost: 50000,
						type: UpgradeType.SCRIPTS
					},
					{
						id: UpgradeID.SCR_HACK_RAINBOW,
						name: "Rainbow Tables",
						desc: "50 GB/s",
						cost: 500000,
						type: UpgradeType.SCRIPTS
					}
				]
			}
		]
	}
]