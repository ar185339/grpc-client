$(document).ready(function() {

  let colors = ['red', 'blue', 'green', 'goldenrod', 'yellowgreen']
  let counter = 1;

  $("#addrow").on("click", function () {
      let newRow = $("<tr>");
      let cols = "";

      cols += '<td><input type="text" class="form-control" name="order' + counter + '"/></td>';
      cols += '<td><input type="text" class="form-control" name="address' + counter + '"/></td>';
      cols += '<td><input type="time" class="form-control" name="from' + counter + '"/></td>';
      cols += '<td><input type="time" class="form-control" name="to' + counter + '"/></td>';

      cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
      newRow.append(cols);
      $("table.order-list").append(newRow);
      counter++;
  });

  $("table.order-list").on("click", ".ibtnDel", function (event) {
      $(this).closest("tr").remove();       
      counter -= 1
  });

  $("#submit").on("click", function () {
    let address = [];
    $("tbody tr").each(function (i) {
        let addr = $('input[name$="address'+i+'"]').val()
        if(addr) {
          address.push(addr.split(' ').join('+'));
        }
    });
    makeCall(JSON.stringify(address));
  });

  const makeCall = (data) => {
    $.ajax({
      method: 'post',
      url: '/grpc',
      data: {address: data},
      success: function(res) {
        addMap(res)
      }
    })
  }

  const addControl = (wayPoints, i) => {
    L.Routing.control({
      router: L.Routing.mapbox('pk.eyJ1IjoiYW5raXRyYWpuY3IiLCJhIjoiY2tkOGVud25lMDhrYzMxbWtidGl2eWVqZSJ9.3Z4mrA7gWHF_ur5c_ElGlA'),
      waypoints: wayPoints,
      routeWhileDragging: true,
      lineOptions: {
        styles: [{color: colors[i]}]
      }
  }).addTo(map);
  }

  const prepareData = (vehicle, destination, i) => {
    let wayPoints = []
    if (vehicle.route.length > 2) {
      vehicle.route.forEach(val => {
        wayPoints.push(L.latLng(destination[val]['lat'], destination[val]['long']));
      });
      addControl(wayPoints, col);
      col += 1;
    }
  }

  const addMap = (data) => {
    data['result'].forEach(element => {
      prepareData(element, data['destination']);
    });
  }

  col = 0
  let map = L.map('map');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);
    
});



