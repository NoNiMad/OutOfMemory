## Scénario
On va voler des données. Les données que l'on récupère peuvent être vendues pour de l'argent. A chaque fois on ne peut pas tout récupérer donc on doit choisir les fichiers en fonction de la place qu'on a et de leur valeur potentielle.
On explore en fait un système de fichier et on copie des trucs.

On peut améliorer toute sorte de choses :
- La taille du support de stockage
- La vitesse d'écriture
- Les algorithmes de compression
- La puissance de calcul, qui sert à :
	- Compression automatique
	- Hacker un mot de passe d'une archive
- Système de détection de la valeur d'une données
	- Image compromettante, mot de passe, etc...
	- Recherche

## Gameplay loop
1. On lance une "mission"
	- Génération aléatoire d'un système de fichier
	- Délais pour réussir car détection au bout d'un moment (comme Hacker Revolution)
		- Ejection automatique à la fin avec ce qu'on a déjà eu
		- Mais pénalité car amende du gouvernement (au moins 50% pour encourager à pas le faire)
2. On récupère des fichiers, le plus possible/la plus grande valeur/la plus grande
3. On se déconnecte avant le temps imparti
	- On a un bonus si remplissage élevé
4. On vend les données récupérées automatiquement avec un petit résumé de fin de mission
5. On améliore son équipement et accumule des connaissances = algorithmes, hacking, etc...

## Types de fichier

- Texte
- Image
- Vidéo
- Fichier protégé

## Upgrades

- Taille du stockage
- Vitesse de la connexion = Réduit le temps de copie d'un fichier
	- Modem 56k
	- ADSL
	- VDSL
	- Fibre
- Compression = Le fichier volé prend moins de place en local, une upgrade par type de fichier (peut prendre du temps si activé par ex)
	- Texte
	- Image
	- Vidéo
- Analyse
	- Valeur = Estimation de la valeur d'un fichier (éventuellement plusieurs niveaux pour qu'il devienne plus précis)
		- Niveau 1 = 1-3 étoiles
		- Niveau 2 = Ordre de grandeur du prix (K€, M€, etc...)
		- Niveau 3 = Prix exact
		- Niveau 4 = Fonctionne sur les dossiers
	- Filtre par type
		- Niveau 1 = Dans le dossier courant
		- Niveau 2 = Filtre les dossiers qui n'en contiennent pas
	- Tri par taille
	- Taille d'un dossier
- Scripts
	- Prendre tous les fichiers d'un dossier
	- Bruteforce
	- Epic File Finder = Trouve les fichiers protégés en un certain temps
		- Chaque fois qu'il en trouve un, affiche une icône sur chaque partie du chemin qui le contient
		- Améliorations de vitesses

## Future version complète

- Liens symboliques !
- Fichier piégé
	- Si on tente de le DL sans anti-virus ça fait perdre du temps ou des fichiers
- Opérations qui prennent du temps = Mini-jeu
	- Téléchargement : Déplacement des fichiers
	- Déchiffrement : ?
	- Compression : Sélectionner des blocs similaires comme un memory mais tout est visible

Gameplay arcade = vaincre un système de fichier donné (en plusieurs fois)



			{
				id: UpgradeID.SCR_STEAL_FOLDER,
				name: "steal_folder_files.sh",
				desc: "Steal all the files in the current folder",
				cost: 10000,
				type: UpgradeType.SCRIPTS
			},
			{
				name: "Rarity_Sniffer.sh",
				desc: "Locate the protected files by searching all the folders",
				children:
				[
					{
						id: UpgradeID.SCR_SNIF_FREE,
						name: "Student version",
						cost: 1000,
						type: UpgradeType.ANALYSIS
					},
					{
						id: UpgradeID.SCR_SNIF_PREM,
						name: "Premium sniffer",
						cost: 100000,
						type: UpgradeType.ANALYSIS
					},
					{
						id: UpgradeID.SCR_SNIF_VIP,
						name: "VIP niffler",
						cost: 10000000,
						type: UpgradeType.ANALYSIS
					}
				]
			},