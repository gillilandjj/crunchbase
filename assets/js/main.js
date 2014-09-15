$( document ).ready(function() {
    
  $(':text').keyup(function(e){
    if(e.keyCode == 13)
    {
      $(this).trigger("enterKey");
    }
  });

  var ladda = {};
  var key = '1be853772d54cbc9d512d02be3fa0867';
  var organization = 'http://api.crunchbase.com/v/2/organization/';
  var data = [];
  var row = [];
  row.push('Company');
  row.push('Description');
  row.push('Categories');
  row.push('Founders');
  row.push('Website');
  row.push('Employees');
  row.push('Products');
  data.push(row);

  $(':text').bind("enterKey", addToTable);
  $( "#org-search" ).click(function(e) {
	 	ladda = Ladda.create(this);
    addToTable();
  });
  $( "#download-csv" ).click(downloadCSV);

  function addToTable() {
    var org_name = $('#org-name').val();
    if (org_name.length > 0) {
    ladda.start();

      $.ajax({
          url: organization + org_name,
       
          // the name of the callback parameter, as specified by the YQL service
          jsonp: "callback",
       
          // tell jQuery we're expecting JSONP
          dataType: "jsonp",
       
          // tell YQL what we want and that we want JSON
          data: {
              user_key: key 
          },
       
          // work with the response
          success: function( response ) {
            ladda.stop();
            //alert( JSON.stringify(response) ); // server response
            var company,
                description = [],
                categories = [],
                website,
                founders = [],
                employees,
                products = [],
                row = [];

            company = response.data.properties.name;
            description.short = response.data.properties.short_description;
            description.long = response.data.properties.description;
            employees = response.data.properties.number_of_employees;

            $.each( response.data.relationships.founders.items, function( key, value ) {
              founders.push("<a href='http://www.crunchbase.com/"+value.path+"' target='_blank'>"+value.name+"</a>");
            });

            $.each( response.data.relationships.categories.items, function( key, value ) {
              categories.push(value.name);
            });

            $.each( response.data.relationships.products.items, function( key, value ) {
              products.push("<a href='http://www.crunchbase.com/"+value.path+"' target='_blank'>"+value.name+"</a>");
            });

            website = "<a href='"+response.data.properties.homepage_url+"' target='_blank'>"+response.data.properties.homepage_url+"</a>";

            var table_row = [
              '<tr>',
              '<td>'+company+'</td>',
              '<td>'+description.short+'</td>',
              '<td>'+categories.join(', ')+'</td>',
              '<td>'+founders.join(', ')+'</td>',
              '<td>'+website+'</td>',
              '<td>'+employees+'</td>',
              '<td>'+products.join(', ')+'</td>',
              '</tr>'
              ];
            row.push(company);
            row.push(description.short);
            row.push(categories.join('; '));
            row.push(founders.join('; '));
            row.push(website);
            row.push(employees);
            row.push(products.join('; '));
            data.push(row);

            $('#results-table > tbody:last').append(table_row.join(''));
          }
      });
    }
  }

  function downloadCSV() {
    //var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
            csvContent += index < infoArray.length ? dataString+ "\n" : dataString;
    }); 
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }
});
