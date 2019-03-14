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
  $('main').html('');
  Critter.all_critters.forEach(critter => {
    // finds the main tag and adds the rendered critter, from Handlebars conversion
    $('main').append(critter.render())
    // this prevents duplicate options from existing in the filter list
    if(!Critter.options.includes(critter.keyword))
      Critter.options.push(critter.keyword);
  });

  Critter.create_options();
}

//logs all critters from JSON file
Critter.prototype.render = function(){
  let $template = $('#photo-template').html();
  let compiledTemplate = Handlebars.compile($template);

  return compiledTemplate(this);
}

$('select').on('change', function () {
  let $selection = $(this).val();
  $('section').hide();
  $(`.${$selection}`).show();
  if ($selection === 'default') $('section:not(#photo-template)').show();
})

//putting handler on the links for next and previous page
$('.page-link').on('click', function (){
  console.log(this);
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


