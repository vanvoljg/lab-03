'use strict';

//constructor function for horned critters
let Critter = function(horned_creature){
  this.image_url = horned_creature.image_url;
  this.title = horned_creature.title;
  this.description = horned_creature.description;
  this.keyword = horned_creature.keyword;
  this.horns = horned_creature.horns;
}

Critter.all_critters = [];
Critter.options = [];
let currentPage = 1;

//takes Critter data from JSON file
Critter.load_data = () => {
  Critter.all_critters = [];
  //takes in the file path for page 1 and treats it as a variable so we can change it later
  $.get(`./data/page-${currentPage}.json`, 'json')
    .then(data => {
      data.forEach(element => {
        Critter.all_critters.push(new Critter(element));
      });
    })
    .then(Critter.display_all)
}


//render function
Critter.display_all = () =>{
  // clears the rendered content in the <main> tag, preparing to replace with new data
  $('main').html('');
  $('option:not([value="default"])').remove();
  Critter.options = [];
  Critter.all_critters.forEach(critter => {
    // finds the main tag and adds the rendered critter, from Handlebars conversion
    $('main').append(critter.render())
    // this prevents duplicate options from existing in the filter list
    if(!Critter.options.includes(critter.keyword))
      Critter.options.push(critter.keyword);
  });

  Critter.create_options();
}

//function to sort critters multiple ways
Critter.sortByTitle = () =>{
  return Critter.all_critters.sort( (a, b) =>{
    return a.title.toUpperCase() > b.title.toUpperCase();
  });
}

Critter.sortByHorns = () =>{
  return Critter.all_critters.sort( (a, b) =>{
    return a.horns - b.horns;
  });
}

//logs all critters from JSON file
Critter.prototype.render = function(){
  let $template = $('#photo-template').html();
  let compiledTemplate = Handlebars.compile($template);

  return compiledTemplate(this);
}

//This function filters the shown items based on dropdown list selection
$('select').on('change', function () {
  let $selection = $(this).val();
  $('section').hide();
  $(`.${$selection}`).show();
  if ($selection === 'default') $('section:not(#photo-template)').show();
})

//callback function that sorts by either number of horns or name of critter
$('.sort-link').on('click', function(){
  let sortType = this.id.slice(3);
  if (sortType === 'horns') Critter.sortByHorns();
  if (sortType === 'title') Critter.sortByTitle();
  console.log(Critter.all_critters);
  Critter.display_all();
});

//putting handler on the links for next and previous page
$('.page-link').on('click', function (){
  if(this.id === 'next-page'){
    //ternary operator: if our current page is 2, keep it as 2 when clicking 'next'
    (currentPage === 2) ? currentPage = 2: currentPage++;
    Critter.load_data();
  } else{
    (currentPage === 1) ? currentPage = 1: currentPage--;
    Critter.load_data();
  }
})

Critter.create_options = function() {
  Critter.options.forEach( (keyword) => {
    $('select').append('<option value=' + keyword + '>' + keyword + '</option>');
  });
}

//loads data when page is ready
$(()=>Critter.load_data());


