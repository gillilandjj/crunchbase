$( document ).ready(function() {

  var resultsTable = $('#results-table').DataTable({
    "dom": 'T<"clear">lfrtip',
        "tableTools": {
            "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
        }
});
  $('#error-code').hide();
    
  $(':text').keyup(function(e){
    if(e.keyCode == 13)
    {
      $(this).trigger("enterKey");
    }
  });

  var ladda = null;
  var key = '1be853772d54cbc9d512d02be3fa0867';
  var organization = 'http://api.crunchbase.com/v/2/organization/';
  var row = [];

  $(':text').bind("enterKey", addToTable);
  $( "#org-search" ).click(addToTable);
  $( "#download-csv" ).click(downloadCSV);

  function addToTable() {
    if (ladda == null) {
	 	  ladda = Ladda.create($('#org-search')[0]);
    }

    var org_name = $('#org-name').val();
    if (org_name.length > 0) {

      //Start the spinner
      $('#error-code').hide();
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

            var company,
                description = [],
                categories = [],
                website = {},
                founders = [],
                employees = {},
                products = [],
                offices = [],
                news = {},
                row = [];

            if (response) {
              if (response.data) {
                if (response.data.properties) {
                  company = "<a href='http://www.crunchbase.com/organization/"+response.data.properties.permalink+"' target='_blank'>"+response.data.properties.name+"</a>";
                  description.short = response.data.properties.short_description;
                  description.long = response.data.properties.description;
                  employees = response.data.properties.number_of_employees;
                  website = "<a href='"+response.data.properties.homepage_url+"' target='_blank'>"+response.data.properties.homepage_url+"</a>";
                }

                if (response.data.relationships) {
                  if (response.data.relationships.founders) {
                    $.each( response.data.relationships.founders.items, function( key, value ) {
                      founders.push("<a href='"+response.metadata.www_path_prefix+value.path+"' target='_blank'>"+value.name+"</a>");
                    });
                  }

                  if (response.data.relationships.categories) {
                    $.each( response.data.relationships.categories.items, function( key, value ) {
                      categories.push(value.name);
                    });
                  }

                  if (response.data.relationships.products) {
                    $.each( response.data.relationships.products.items, function( key, value ) {
                      products.push("<a href='"+response.metadata.www_path_prefix+value.path+"' target='_blank'>"+value.name+"</a>");
                    });
                  }

                  if (response.data.relationships.news) {
                    var lastNews = response.data.relationships.news.items[response.data.relationships.news.items.length-1];
                    news = "<a href='"+lastNews.url+"' target='_blank'>"+lastNews.title+"</a>";
                  }

                  if (response.data.relationships.offices) {
                    $.each( response.data.relationships.offices.items, function( key, value ) {
                      offices.push(value.name + " - " + value.city + " " + value.region);
                    });
                  }
                }
              }
            }

            row.push(company);
            row.push(description.short);
            row.push(categories.join('; '));
            row.push(founders.join('; '));
            row.push(website);
            row.push(employees);
            row.push(products.join('; '));
            row.push(offices.join('; '));
            row.push(news);

            resultsTable.row.add(row).draw();
          },

          error: function() {

            $('#error-code').show();
          },

          complete: function () {

            // Stop the spinner
            ladda.stop();
          }
      });
    }
  }

  function downloadCSV() {

    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
            csvContent += index < infoArray.length ? dataString+ "\n" : dataString;
    }); 
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }
});
