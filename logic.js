document.addEventListener("DOMContentLoaded", () => {
    
    let currentRecipe = [];
    let currentInsertedComponents = [];
    let isGameActive = true;
    startNewRound();
    const button = document.getElementsByClassName("button")[0];
    let timer = document.getElementById("timer");
    let currentTime = 0; 
    let streakBonus = 20;
    let streakCount = 0;
    let score = 0;
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = `Score: ${score},  Streak: ${streakCount}`;

    button.addEventListener("click", () => {
        startNewRound();
        streakCount = 0;
        scoreDisplay.textContent = `Score: ${score},  Streak: ${streakCount}`;
    });

    setInterval(() => {
        currentTime++;
        let seconds = currentTime % 60;
        let minutes = Math.floor(currentTime / 60);
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);


    function getRandomElement() {
        const arrayChoice = Math.random() < 0.5 ? fullItems : midItems;
        const randomIndex = Math.floor(Math.random() * arrayChoice.length);
        return arrayChoice[randomIndex]; 
    }

    function showRandomItem() {
        const randomItem = getRandomElement();
        const displayDiv = document.getElementById("items");

        const img = document.createElement("img");
        img.src = randomItem.url;

        displayDiv.innerHTML = "";
        displayDiv.appendChild(img);

        return randomItem;
    }

    function getComponents(arr, count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            result.push(arr[randomIndex]);
        }
        return result;
    }

    function showComponents(count) {
        const selectedArr = getRandomElement();
        let components = [];
        const randomItem = showRandomItem();
        const recipe = getRecipe(randomItem);
        

        if(fullItems.some(item => item.name === selectedArr.name)){
            if(recipe){
                components = getComponentsByRecipe(recipe);
            }
            components = components.concat(getComponents(sostavlyaushie, count - components.length));
            components = components.concat(getComponents(midItems, count - components.length));
        }else if(midItems.some(item => item.name === selectedArr.name)){
            if(recipe){
                components = getComponentsByRecipe(recipe);
            }
            components = components.concat(getComponents(sostavlyaushie, count - components.length));
        }

        if(components.length > count){
            components = components.slice(0, count);
        }

        shuffleArray(components);

        const displayComponents = document.getElementById("main-items");
        displayComponents.innerHTML = "";

        components.forEach(component => {
            const img = document.createElement("img");
            img.src = component.url;
            img.alt = component.name;
            img.addEventListener("click", () => handleClick(component));
            displayComponents.appendChild(img);
        });
    }   

    function startNewRound() {
        if(isGameActive){
            const randomItem = showRandomItem();
            getRecipe(randomItem);
            showComponents(10);
        }
    }

    function getRecipe(randomItem) {
        currentRecipe = recipes[randomItem.name] || [];
        currentInsertedComponents = Array(currentRecipe.length).fill(null);
        const recipeContainer = document.getElementById("recipe-items");
        recipeContainer.innerHTML = "";
        for(let i = 0; i < currentRecipe.length; i++){
            const img = document.createElement("img");
            img.src = "img/full_items/question-mark.png";
            img.alt = "question mark";
            img.addEventListener("click", handleRemoveClickWrapper);
            recipeContainer.appendChild(img);
        }
        return currentRecipe;
    }

    function getComponentsByRecipe(recipe){
        return recipe.map(item => {
            return [...midItems, ...sostavlyaushie].find(element => element.name === item);
        }).filter(item => item !== undefined);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    }

    function handleClick(component){
        const recipeContainer = document.getElementById("recipe-items").children;
        const firstEmptyIndex = currentInsertedComponents.findIndex(item => item === null);

        if(firstEmptyIndex !== -1){
            currentInsertedComponents[firstEmptyIndex] = component.name;
            recipeContainer[firstEmptyIndex].src = component.url;

            if(currentInsertedComponents.every(item => item !== null)){
                checkRecipeCompletion();
            }
        }
    }

    function checkRecipeCompletion() {

        const sortedRecipe = [...currentRecipe].sort();
        const sortedInserted = [...currentInsertedComponents].sort();

        const isCorrect = sortedInserted.every((item, index) => item === sortedRecipe[index]);
    
        if (isCorrect) {
            alert("Сборка завершена успешно!");
            score += 100 + streakBonus * streakCount;
            streakCount++;
            scoreDisplay.textContent = `Score: ${score},  Streak: ${streakCount}`;
            isGameActive = false;
            setTimeout(() => {
                isGameActive = true;
                startNewRound();
            }, 1000);
        } else {
            alert("Ошибка сборки! Попробуйте снова.");
            resetRecipeDisplay();
            streakCount = 0;
            scoreDisplay.textContent = `Score: ${score},  Streak: ${streakCount}`;
        }
    }

    function resetRecipeDisplay() {
        const recipeContainer = document.getElementById("recipe-items");
        currentInsertedComponents.fill(null);
        recipeContainer.innerHTML = "";

        currentRecipe.forEach(() => {
            const img = document.createElement("img");
            img.src = "img/full_items/question-mark.png";
            img.alt = "question mark";
            recipeContainer.appendChild(img);
        });
    }

    function handleRemoveClick(componentElement, index) {
    
        currentInsertedComponents[index] = null;
    
        componentElement.src = "img/full_items/question-mark.png";
        componentElement.alt = "question mark";
        
        componentElement.removeEventListener("click", handleRemoveClickWrapper);
    }

    function handleRemoveClickWrapper(event) {
        const componentElement = event.target;
        const index = Array.from(componentElement.parentNode.children).indexOf(componentElement);
        handleRemoveClick(componentElement, index);
    }
});
