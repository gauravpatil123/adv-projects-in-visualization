d3.csv("../data/greenhouse gases/normalized_historical_ghg.csv").then(dataset => {
    dataset.forEach(d => {
        d.iso = d["ISO"];
        d.country = d["Country"];
        d.data_source = d["Data source"];
        d.sector = d["Sector"];
        d.gas = d["Gas"];
        d.unit = d["Unit"];
        d.year = +d["Year"];
        d.total_ghg = +d["Total GHG"];
    });

    //console.log(dataset);

    // global variables
    const margin = 100;
    const width = 800;
    const height = 800;

    // start visualization with 1750 data
    function xScale(dataset_to_use){

        return d3.scaleBand()
                .domain(dataset_to_use.map(d => d.country))
                .range([margin, width - margin])
                .paddingInner(0.2)
                .paddingOuter(0.2);

    } 

    function botAxis(xscale) {

        return d3.axisBottom().scale(xscale);

    }
    
    function yScale(maxY) {

        return d3.scaleLinear()
                .domain([0, maxY])
                .range([height - margin, margin]);                        

    }
    
    function leftAxis(yscale) {

        return d3.axisLeft().scale(yscale);

    }

    let currYear = 1990
    const countries_1990 = dataset.filter(d => d.year == currYear);
    //console.log(countries_1990);
    const max_1990 = countries_1990.sort((a, b)=>d3.descending(a.total_ghg, b.total_ghg));
    //console.log(max_1990);
    let curr_data = max_1990.filter(d => d.total_ghg > 0);
    curr_data = curr_data.length > 10 ? curr_data.slice(0,10) : curr_data;
    //console.log(curr_data);

    // chart
    let currXscale = xScale(curr_data);
    let currBotAxis = botAxis(currXscale);
    let currMaxY = d3.max(curr_data, d => d.total_ghg);
    let GloMaxY = d3.max(dataset, d => d.total_ghg)
    let currYscale = yScale(GloMaxY);
    let currLeftAxis = leftAxis(currYscale);

    function updateData(currYear){

        let curr_countries = dataset.filter(d => d.year == currYear);
        curr_countries = curr_countries.sort((a, b) => d3.descending(a.total_ghg, b.total_ghg));
        curr_data = curr_countries.filter(d => d.total_ghg > 0);
        //console.log(curr_data);
        curr_data = curr_data.length > 10 ? curr_data.slice(0, 10) : curr_data;
        //console.log(curr_data);
        curr_data = curr_data.sort((a, b) => d3.ascending(a.total_ghg, b.total_ghg))

        currXscale = xScale(curr_data);
        currBotAxis = botAxis(currXscale);
        currMaxY = d3.max(curr_data, d => d.total_ghg);
        GloMaxY = d3.max(dataset, d => d.total_ghg)
        currYscale = yScale(GloMaxY);
        currLeftAxis = leftAxis(currYscale);

        currColorScale = d3.scaleLinear()
                            .domain([0, currMaxY])
                            .range(["#F09D97","#DF544A"]); //#DF544A "#0052F9","#FAB10F"

    }

    function updateChart(){

        svg_ghg.selectAll("g")
                .remove();

        svg_ghg.selectAll("text")
                .remove();

        svg_ghg.selectAll("rect")
            .data(curr_data)
            .join("rect")
            .attr("class", "rects")
            .transition()
            .ease(d3.easeLinear)
            .attr("x", d => currXscale(d.country))
            .attr("y", d => currYscale(d.total_ghg))
            .attr("width", currXscale.bandwidth())
            .attr("height", d => (height - margin) - currYscale(d.total_ghg))
            .attr("fill", d => currColorScale(d.total_ghg))
            
        svg_ghg.append("g")
             .attr("class", "axis")
             .attr("id", "bot")
             .attr("transform", "translate(0," + (height - margin) + ")")
             .call(currBotAxis);
    
        svg_ghg.append("g")
            .attr("class", "axis")
            .attr("id", "left")
            .attr("transform", "translate(" + margin + ",0)")
            .call(currLeftAxis);

        svg_ghg.append("text")
            .attr("x", 120)
            .attr("y", 60)
            .attr("class", "title")
            .text("Top country's for total GHG emissions in the year " + currYear);

        svg_ghg.append("text")
            .attr("x", 10)
            .attr("y", 460)
            .attr("class", "axis-labels")
            .text("Total GHG Emissions")
            .attr("transform", "rotate(-90, 50, 460)")

        svg_ghg.append("text")
            .attr("x", 370)
            .attr("y", 750)
            .attr("class", "axis-labels")
            .text("Countries")

        svg_ghg.selectAll("rect")
                .data(curr_data)
                .join("rect")
                .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                .transition()
                .duration(300)
                .style("opacity", 1)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY + 0) + "px")
                tooltip.html("Total GHGs: " + "<br>" + Math.trunc(d.total_ghg)); //truncating the emission value to round off
            })
            .on("mouseout", (event, d) => {
                d3.select("#tooltip")
                .transition()
                .style("opacity", 0);
            })
            .on("mousemove", (event, d) => {
                d3.select("#tooltip")
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY + 0) + "px")
            });

    }

    const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

    const svg_ghg = d3.select("svg");

    d3.select("input")
        .on("change", (event, d) => {

            currYear = event.currentTarget.value;
            updateData(currYear)
            updateChart()

        });

    updateData(currYear)
    updateChart()

})
