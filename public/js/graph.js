let ctx = document.getElementById('myChart').getContext('2d');

    let massPopChart = new Chart(ctx, {
        type:'pie',
        data : {
            labels: [
                'Ναι',
                'Οχι'
            ],
            datasets: [{
                data: [8, 4],
                backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
                ],
                
            }]
        }
    });