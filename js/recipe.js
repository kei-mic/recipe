
//---dom elements
const rand = document.querySelector('button');
rand.addEventListener('click', fetchRecipe);
const menu = document.querySelector('#menu');
const category = document.querySelector('#categories');
const recipeBox = document.querySelector('#recipe-box');
const recipeDetails = document.querySelector('#recipe-details');
console.log('category', category);

//---create categories
function createCategories(){
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php", {method: 'GET'})
    .then(jsonRes => jsonRes.json())
    .then(obj => {     
        console.log('obj', obj); //test output   
        //--clickable category tag for each category
        obj.categories.forEach(e => {
            // console.log('e', e.strCategory);//test output
            const option = document.createElement('div');
            option.className = 'category-opt';
            option.id = e.idCategory;
            option.value = e.strCategory;
            option.innerText = e.strCategory;
            option.addEventListener('click', fetchRecipe)
            category.appendChild(option);
        })
    });
}//end createCategories
createCategories();

//---fetch recipies - main level, recipie cards
function fetchRecipe(){
    
    recipeBox.innerHTML = '';//clears page

    let baseURL = "https://www.themealdb.com/api/json/v1/1/";
    let url = baseURL;
    console.log('this:', this, this.value);

    if(this.value){//categories
        url += `filter.php?c=${this.value}`;
    } else {//default view
        url += `random.php`;
    }

    fetch(url, {method: 'GET'})
    .then(jsonRes => jsonRes.json())
    .then(obj => {     
        console.log('obj', obj);
        obj.meals.forEach(m => {//fill the recipe box with recipes
            const div = document.createElement('div');
            div.className = 'category-grid';
            div.value = m.idMeal;
            div.addEventListener('click', fetchMeal);//fetch recipie details when picture is clicked
            recipeBox.appendChild(div);
            //recipie name
            const h2 = document.createElement('h2');
            h2.innerHTML = m.strMeal;
            div.appendChild(h2);
            //recipie pic
            let pic = new Image();
            pic.src = m.strMealThumb;
            div.appendChild(pic);            
        })
    })
}//end fetchRecipie

//---get the recipie card with full details
function fetchMeal(){
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${this.value}`;
    fetch(url, {method: 'GET'})
    .then(jsonRes => jsonRes.json())
    .then(obj => { 
        console.log('recipie details obj', obj);//test output
        //--recipe details overlay
        recipeDetails.style.display = 'block';//makes overlay visible
        recipeDetails.innerHTML = '';//clears recipe overlay
        //--overlay background
        const bkgd = document.createElement('div');
        bkgd.className = 'overlay-bkgd';
        bkgd.style.display = 'inherit';
        bkgd.addEventListener('click', ()=> {//close overlay when outside of it is clicked
            recipeDetails.style.display = 'none';
            bkgd.style.display = 'none';
        })
        recipeBox.appendChild(bkgd);

        //--recipe card
        const div = document.createElement('div');
        div.className = 'recipie-card';
        recipeDetails.appendChild(div);

        const h2 = document.createElement('h2');//recipe name
        h2.innerHTML = obj.meals[0].strMeal;
        div.appendChild(h2);

        let pic = new Image();//recipe image
        pic.src = obj.meals[0].strMealThumb;
        div.appendChild(pic);

        let text = document.createElement('div');//div to hold the text content
        text.className = 'text-box'
        div.appendChild(text);

        const ingrHeader = document.createElement('h3');//ingredients section header
        ingrHeader.innerHTML = `Ingredients`;
        text.appendChild(ingrHeader);

        let ul = document.createElement('ul');//ingredients
        for(let i = 1; i<20; i++){
            const ikey = `strIngredient${i}`;
            const li = document.createElement('li');
            const mkey = `strMeasure${i}`;
            if(obj.meals[0][mkey]) li.textContent = `${obj.meals[0][mkey]}`;
            if(obj.meals[0][ikey]) li.textContent += `  -  ${obj.meals[0][ikey]}`;
            if(obj.meals[0][ikey]) ul.appendChild(li);
        }
        text.appendChild(ul);

        const instHeader = document.createElement('h3');//instructions section header
        instHeader.innerHTML = `Instructions`;
        text.appendChild(instHeader);

        let instructions = document.createElement('p');//instructions
        let inst = obj.meals[0].strInstructions.replaceAll('.', '. <br><br>');
        instructions.innerHTML = inst;
        text.appendChild(instructions);

        let source = document.createElement('p');//recipe source
        source.innerHTML = obj.meals[0].strSource;
        source.className = 'source';
        text.appendChild(source);
    })

}//end fetchMeal

fetchRecipe();