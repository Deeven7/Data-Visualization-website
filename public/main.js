
// Form Submit 

const form = document.getElementById("pet-votes");


form.addEventListener('submit', function(e) {
  const choice = document.querySelector('input[name=pets]:checked').value;
  const data = {pets: choice};
  
  fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type':'application/json'
        })
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
  
   e.preventDefault();

   
});


// Using Canvas.js

fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
   const votes = data.votes;
   const voteCounts = votes.reduce(
       (acc, vote) => (
           (acc[vote.pets] = (acc[vote.pets] || 0) + parseInt(vote.points)),acc
       )
   )

   let dataPoints = [
    {label: 'Dogs', y: voteCounts.Dogs},
    {label: 'Cats', y: voteCounts.Cats},
    {label: 'Fish', y: voteCounts.Fish},
    {label: 'Birds', y: voteCounts.Birds},
    {label: 'Other', y: voteCounts.Other}
   ];

 const chartContainer = document.querySelector('#chartContainer');

 if(chartContainer){
  const chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'theme2',
    title:{
        text: `Statistics`
    },
    data: [
        {
           type: 'column',
           dataPoints: dataPoints 
        }
    ]
  });
  chart.render();

  
  //Pusher.logToConsole = true;

    var pusher = new Pusher('735625af503737a04182', {
      cluster: 'us2',
      forceTLS: true
    });

    var channel = pusher.subscribe('pet-poll');
    channel.bind('pet-vote', function(data) {
      dataPoints = dataPoints.map(x => {
         if(x.label == data.pets){
          x.y += data.points;
          return x;
         }else{
             return x;
         } 
      });
      chart.render();
    });

 }


});      












