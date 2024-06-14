var idleTimer = null
var queue = []
var DBqueue = []
var subTypes = null
var TwitchToken = null
var TwitchClientId = null
var timeoutId = null
var streamer = null

var token = null

var Engine = Matter.Engine,
	World = Matter.World,
	Events = Matter.Events,
	Bodies = Matter.Bodies;

var engine;
var world;
var particles = [];
var particlesCounter = 0;
var plinkos = [];
var bounds = [];
var options = []
var pity = false;
for (let i = 1; i < 13; i++) { options.push(`option ${i}`) }
var usedOptions = options
colorGradiant = ["#ff2400", "#ff4900", "#ff6d00", "#ff9200", "#ffb600", "#ffdb00"]
// var rows = 13;
var particleRadius = 35;
var plinkoRadius = 3;
var boundryHeight = 50;
var start = 0
var ratio = 1080 / 1920