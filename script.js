const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const getData = async () => {
    const response = await fetch(url)
    const data = await response.json()
    const dataset = data
    const yearData = dataset.map((i) => i.Year)
    const timeData = dataset.map((i) => new Date(i.Seconds * 1000))
    
    // console.log(yearData)
    // yearData.forEach((i)=>console.log(i))

    const width = 800;
    const height = 600;
    const padding = 60;
    
    const svgCanvas = d3.select('body').append('svg').attr('width', width).attr('height', height).attr('class', 'svgCanvas')

    const xScale = d3.scaleLinear().domain([d3.min(yearData) -1, d3.max(yearData) + 1]).range([padding, width - padding])
    const yScale = d3.scaleTime().domain([d3.max(timeData), d3.min(timeData)]).range([height - padding, 0 + padding])

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
    
    svgCanvas.append("g").attr("transform", "translate(0," + (height - padding) + ")").attr('id', 'x-axis').call(xAxis).style('color', 'black');
    svgCanvas.append("g").attr("transform", `translate(${padding})`).attr('id', 'y-axis').call(yAxis).style('color', 'black');

    svgCanvas.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', (d) => 7)
    .style('border-color', 'black')
    .style('border-style', 'solid')
    .attr('data-xvalue',(d)=>d.Year)
    .attr('data-yvalue', (d)=> new Date(d.Seconds * 1000))
    .attr('fill', (d => {return d.Doping === '' ? 'rgba(120, 98, 245, 0.8)' : 'rgba(245, 34, 34, 0.8)'}))
    .attr('id', (d => {return d.Doping === '' ? 'blue-circle' : 'red-circle'}))
    
    svgCanvas.selectAll('.dot')
    .data(yearData)
    .attr('cx', (d) => xScale(d))
    .data(timeData)
    .attr('cy', (d => yScale(d)))
    
    d3.select('.svgCanvas').append('div').attr('id', 'legend').attr('position', 'absolute').attr('right', 100)
    d3.select('.svgCanvas').append('text').text('No doping allegations').attr('id', 'doping').attr('x', width - padding - 130).attr('y', 100).attr('fill', 'black')
    d3.select('.svgCanvas').append('rect').attr('id', 'doping-rect').attr('x', width - padding - 145).attr('y', 90).attr('height', 10).attr('width', 10).attr('fill', 'rgba(120, 98, 245, 0.8)').attr('outline', '1.5px solid rgba(0, 0, 0, 0.616)')
    d3.select('.svgCanvas').append('text').text('Riders with doping allegations').attr('id', 'doping').attr('x', width - padding - 130).attr('y', 130).attr('fill', 'black')
    d3.select('.svgCanvas').append('rect').attr('id', 'doping-rect').attr('x', width - padding - 145).attr('y', 120).attr('height', 10).attr('width', 10).attr('fill', 'rgba(245, 34, 34, 0.8)').attr('outline', '1.5px solid rgba(0, 0, 0, 0.616)')

    const tooltip = d3.select('#tooltip')

    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("opacity", "0")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")

    d3.selectAll('.dot')
    .data(dataset)
    .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
        tooltip.style("opacity", "1")
        tooltip.html(`<p>${d.Name}: ${d.Nationality}<br>Year: ${d.Year} Time: ${d.Time}${d.Doping !== '' ? `<br><br>${d.Doping}` : ''}</p>`)
        tooltip.attr('data-year', d.Year)
    })    
    .on("mousemove", (event, d) => {
        const x = event.x
        const y = event.y
            return tooltip.style('top', y + 10 + 'px').style('left', x + 10 +'px')})
    .on("mouseout", () => {return tooltip.style("opacity", "0").style('visibility', 'hidden')});
}

document.addEventListener('DOMContentLoaded', getData)

// console.log(d3)