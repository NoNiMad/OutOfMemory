// application du theme et sauvegarde
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function setDefaultTheme(){
    setTheme(DefaultTheme);
}

// application des themes au lancement via la sauvegarde
(function () {
    const theme = localStorage.getItem('theme');
    if (theme !== null){
        setTheme(theme);
    }    
    else{
        setDefaultTheme();
    }
})();