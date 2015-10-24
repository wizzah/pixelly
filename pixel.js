// globals
var canvas_element = document.getElementById("myCanvas");
var ctx = canvas_element.getContext("2d");
var width = canvas_element.width;
var height = canvas_element.height;

var lain_img_data;
var new_img;
function imageLoaded(ev) {

	var lain_img = document.createElement("canvas");
	var context = lain_img.getContext('2d');
	lain_img.width = 1520;
	lain_img.height = 1080;
	context.drawImage(im, 0, 0);
	// get all canvas pixel data
	var imageData = context.getImageData(0, 0, width, height);
	lain_img_data = obj_list(imageData.data);
	//process for making points?
	// console.log(lain_img_data[34]);
}

var points, imageData, pixels;
var color_list = [{r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0}, {r: 0, g: 0, b: 255}, {r: 255, g: 120, b: 50}];

// generate random points
function generate_points(n)
{
	var color_index = 0;
	var color_limit = color_list.length;
	points = [];
	for(var i = 0; i < n; i++)
	{
		points.push({
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height),
			color: color_list[color_index++ % color_limit],
			radius: Math.floor(Math.random() * 50) + 20
		});
		points[i].origin_x = points[i].x;
		points[i].origin_y = points[i].y;
	}
}

function generate_edge_points(n) {
	points = [];
	var color_index = 0;
	var color_limit = color_list.length;
	console.log(color_list[color_index++ % color_limit]);
	for(var i = 0; i < n; i++)
	{
		points.push({x: n+453, y: n+34, color: color_list[color_index++ % color_limit], radius: Math.floor(Math.random() * 50) + 20});
		points[i].origin_x = points[i].x;
		points[i].origin_y = points[i].y;
	}

	console.log(points, n+453);
}

// function generate_stable_color() {
// 	return color_list[Math.floor(Math.random()*color_list.length)];
// }

function Pixel (r, g, b, a) {
     this.r = r;
     this.g = g;
     this.b = b;
     this.a = a;
   }
function obj_list(flat_array) {
 var new_obj = [];
 var len = flat_array.length;
 for(var i = 0; i < len; i += 4) {
   new_obj.push(new Pixel(
       flat_array[i],
       flat_array[i + 1],
       flat_array[i + 2],
       flat_array[i + 3]
     ));
 }
 return new_obj
}


function move_points(t)
{
	var points_len = points.length;
	var radius = 20;
	var degree = (t*5 % 360) * (Math.PI / 180);
	for(var i = 0; i < points_len; i++)
	{
		points[i].x = points[i].origin_x + Math.cos(degree) * points[i].radius;
		points[i].y = points[i].origin_y + Math.sin(degree) * points[i].radius;
	}
}
// get all canvas pixel data
function get_pixels()
{
	imageData = ctx.getImageData(0, 0, width, height);
	pixels = imageData.data;
}

// return closest point to x, y
function findClosestPoint(x, y)
{
	var lowest_dist = width*height;
	var point = -1;
	var points_len = points.length;
	for(var i = 0; i < points_len; i++)
	{
		var dist = distance(x, y, points[i].x, points[i].y);
		if(dist < lowest_dist)
		{
			point = i;
			lowest_dist = dist;
		}
	}
	return points[point];
}
// blend colors based on proxmity 
function proxmityColor(x, y)
{
	var points_len = points.length;
	var distances = [];
	var total_dist = 0;
	var color = {r: 255, g: 255, b: 255};
	for(var i = 0; i < points_len; i++)
	{
		var dist = distance(x, y, points[i].x, points[i].y);
		total_dist += dist;
		distances.push(dist);
	}
	var start_point = ~~(Math.random() * (points_len -3));
	for(var i = start_point; i <start_point+3 ; i++)
	{
		var percent = distances[i] / total_dist;
		color.r -= points[i].color.r * percent;
		color.g -= points[i].color.g * percent;
		color.b -= points[i].color.b * percent;
	}
	return color;	
}
function distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function put_pixels()
{
	var i = 0;
	// console.log(points);
	for(var y = 0; y < height; y++)
		for(var x = 0; x < width; x++)
		{
			var color = proxmityColor(x, y);//findClosestPoint(x, y);
            pixels[i++] = color.r;
            pixels[i++] = color.b;
			pixels[i++] = color.g;
			pixels[i++] = 255;
            if(color.r > color.b) {
            	pixels[i++] = Math.floor((Math.random() * 255) + 0);
                pixels[i++] = stable_color.r;
            }

		}
	imageData.data.set(pixels);
	ctx.putImageData(imageData, 0, 0);
}
var t = 0;
// generate_points(10);
generate_edge_points(5);
var stable_color = {r: Math.floor((Math.random() * 255) + 0), g: Math.floor((Math.random() * 255) + 0), b: Math.floor((Math.random() * 255) + 0)};
// console.log(stable_color);
get_pixels();
setInterval(function(){
	move_points(t++);
	put_pixels();
}, 150)

//load lain image
im = new Image();
im.onload = imageLoaded;
im.src = "lain.jpg"; 
