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
  Critter.all_critters.forEach(critter => {
    critter.render();
    if(!Critter.options.includes(critter.keyword))
      Critter.options.push(critter.keyword);
  });

  Critter.create_options();
}

//logs all critters from JSON file
Critter.prototype.render = function(){
  let $template = $('#photo-template').clone();
  $('main').append($template);
  $template.removeAttr('id');
  $template.addClass(this.keyword);
  let $h2 = $template.find('h2')[0];
  let $img = $template.find('img')[0];
  let $p = $template.find('p')[0];
  $($h2).text(this.title);
  $img.src = this.image_url;
  $img.alt = this.keyword;
  $($p).text(this.description);
}

$('select').on('change', function () {
  let $selection = $(this).val();
  $('section').hide();
  $(`.${$selection}`).show();
  if ($selection === 'default') $('section:not(#photo-template)').show();
})



Critter.create_options = function() {
  Critter.options.forEach( (keyword) => {
    $('select').append('<option value=' + keyword + '>' + keyword + '</option>');
  });
}

//loads data when page is ready
$(()=>Critter.load_data());


