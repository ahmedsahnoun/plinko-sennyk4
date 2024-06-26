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
var heightwidthratio = 1.1
var particleRadius = 35;
var plinkoRadius = 3;
var boundryHeight = 50;
var start = 0
var ratio = 1080 / 1920
var imgLink = "plinko.gif"

var odds=
[
	3,
	15,
	37,
	68,
	80,
	97,
	97,
	80,
	68,
	37,
	15,
	3
]
var gaussian = []
for (let i = 0; i < odds.length; i++){
	var num = odds[i]
	for(let j=0; j < num; j++)
		gaussian.push(i+1)
}

var preseeds = [
    {
        "option": 1,
        "seeds": [
            -2.17053,
            -0.26752
        ]
    },
    {
        "option": 2,
        "seeds": [
            -2.95103,
            -2.49827,
            -0.38279,
            -0.80042,
            -1.0001,
            -0.36669,
            -1.28164,
            -0.26058
        ]
    },
    {
        "option": 3,
        "seeds": [
            -0.21093,
            -0.62176,
            -0.83888,
            -4.10979,
            -0.25786,
            -3.00777,
            -3.68422,
            -2.06845,
            -3.8257,
            -0.16408,
            -4.7703,
            -2.50091,
            -0.73589,
            -2.5413,
            -3.01248,
            -4.34597,
            -1.26582,
            -3.69521,
            -4.30585
        ]
    },
    {
        "option": 4,
        "seeds": [
            -1.1564,
            -2.87114,
            -1.73298,
            4.30368,
            -2.67486,
            -2.16418,
            -0.44878,
            -0.98325,
            -0.36842,
            2.65077,
            -2.13013,
            -2.98517,
            -0.6594,
            -1.1267,
            -2.32355,
            -0.64833,
            4.49635,
            -0.83678,
            -2.8501,
            -2.97966,
            -2.29645,
            2.65291,
            -1.38226,
            -0.16728,
            -2.96453,
            -1.85106,
            2.82536,
            -2.09737,
            -1.21424,
            0.94076,
            -3.96432,
            -2.01514,
            -0.20442,
            -0.34754,
            -1.34469,
            -1.5383,
            -3.30651
        ]
    },
    {
        "option": 5,
        "seeds": [
            -2.18688,
            3.27579,
            -0.43995,
            -0.39301,
            -2.41522,
            2.6364,
            -2.99645,
            -4.31469,
            -1.13089,
            -2.01327,
            -4.30239,
            -2.08081,
            1.02992,
            -4.09754,
            -1.26516,
            1.79446,
            -1.1477,
            -0.77068,
            -4.53636,
            -3.57869,
            4.60488,
            -1.23738,
            1.59054,
            1.01371,
            1.02673,
            1.62063,
            3.16576,
            -2.81853,
            1.77457,
            4.54093,
            -1.43903,
            -0.97477,
            4.0254,
            1.48722,
            -4.06449,
            -2.34495,
            -2.33174,
            -1.054,
            -1.04392,
            -2.09821,
            4.33739,
            2.71669,
            1.48428,
            -1.20975,
            4.64407,
            -1.44012,
            -0.70566,
            -1.26031,
            -3.04249,
            3.31757
        ]
    },
    {
        "option": 6,
        "seeds": [
            -4.0791,
            -3.39836,
            -2.71168,
            -3.36405,
            3.2328,
            -2.23277,
            -1.18151,
            -4.4425,
            1.04568,
            2.82033,
            -0.70398,
            -0.03598,
            3.41511,
            -1.45563,
            1.16047,
            -1.35879,
            -2.85056,
            2.04141,
            -2.07571,
            -2.47816,
            -0.3312,
            -2.27038,
            -2.02433,
            1.80637,
            -1.27179,
            -2.72622,
            -0.97954,
            0.08593,
            -0.78879,
            -0.63128,
            -3.71898,
            2.35974,
            -2.01071,
            2.7625,
            0.30964,
            2.18265,
            2.25778,
            -0.9101,
            -1.47023,
            0.25024,
            -2.86527,
            -3.72064,
            1.80654,
            1.56701,
            0.78574,
            -1.25823,
            3.59485,
            2.86954,
            -2.18842,
            -4.30772,
            1.0551,
            -2.15293,
            -1.14737,
            -3.13149,
            2.18048,
            -1.00858,
            -1.96527,
            2.51152,
            -1.46883,
            -2.72635,
            -1.34689,
            1.45977,
            3.06257,
            -4.00701,
            0.91261,
            -2.27386
        ]
    },
    {
        "option": 7,
        "seeds": [
            -1.70625,
            3.44981,
            0.51063,
            3.44711,
            1.44806,
            2.24345,
            -0.74636,
            1.04553,
            3.18425,
            2.76608,
            -0.78455,
            2.84077,
            -3.14577,
            4.57249,
            0.12002,
            2.85756,
            1.38609,
            -4.66101,
            1.85926,
            1.59825,
            -0.74575,
            -2.00796,
            -2.63574,
            2.67073,
            -0.91364,
            -1.8774,
            2.38362,
            -1.18036,
            -0.51225,
            2.75284,
            -2.48779,
            0.18374,
            -1.11087,
            2.34682,
            -1.02808,
            2.50344,
            -1.86915,
            -3.25364,
            1.74837,
            -2.04202,
            1.11702,
            3.72755,
            2.42819,
            3.83134,
            -1.11247,
            2.66787,
            -2.25068,
            -4.24585,
            0.17663,
            1.45505,
            -3.61564,
            0.03223,
            -0.82652,
            -2.35663,
            -3.32033,
            -2.61279,
            -3.45275,
            1.6371,
            1.4746,
            3.20288,
            3.48485,
            1.83907,
            -2.04284,
            -1.49367,
            -2.27737,
            -2.71921,
            -1.46262,
            0.4963
        ]
    },
    {
        "option": 8,
        "seeds": [
            2.12066,
            3.8237,
            0.13977,
            2.3642,
            0.89289,
            4.46524,
            -1.48163,
            -3.0835,
            1.04805,
            -0.06771,
            -1.80328,
            -0.93116,
            -3.10777,
            0.00054,
            -0.77854,
            0.70609,
            1.29628,
            2.71446,
            0.84047,
            2.62413,
            -1.0242,
            3.87189,
            3.7284,
            0.8423,
            0.89845,
            -1.88688,
            2.46065,
            -1.48812,
            -1.63035,
            4.56955,
            -1.06761,
            2.43209,
            3.39395,
            4.05547,
            -2.75618,
            0.26215,
            1.99478,
            1.50964,
            0.67076,
            3.96024,
            3.21168,
            0.31203,
            2.12808,
            -0.59321,
            1.96449,
            -3.34783,
            2.62363,
            0.75367,
            2.35879,
            2.74702,
            3.5712,
            2.03153,
            -2.39449,
            2.11757,
            -3.01916,
            1.57732,
            1.45056,
            3.09467,
            3.69938,
            -0.07446,
            3.40036,
            0.18976
        ]
    },
    {
        "option": 9,
        "seeds": [
            2.49532,
            3.20221,
            2.25905,
            3.19907,
            4.24633,
            2.54242,
            1.10627,
            2.2971,
            -0.51694,
            0.16616,
            0.28815,
            -3.27443,
            2.30545,
            1.16946,
            2.98178,
            0.80988,
            4.38685,
            0.54872,
            1.29212,
            1.32523,
            2.55474,
            0.17717,
            2.51856,
            -2.0424,
            2.946,
            2.21328,
            2.1171,
            1.23688,
            3.6456,
            2.94253,
            0.20086,
            0.58358,
            2.05886,
            0.43617
        ]
    },
    {
        "option": 10,
        "seeds": [
            1.00181,
            0.21111,
            1.92292,
            0.4648,
            -0.56394,
            0.60613,
            0.51883,
            1.12098,
            0.20646,
            1.29718,
            3.59176,
            0.60845,
            2.7972,
            0.36344,
            0.7382,
            2.57361,
            3.14879,
            0.15235,
            4.14217,
            3.66886,
            1.3775,
            1.36786,
            0.50379,
            0.19659
        ]
    },
    {
        "option": 11,
        "seeds": [
            2.92801,
            2.23899,
            4.10141,
            2.50061,
            2.89995
        ]
    },
    {
        "option": 12,
        "seeds": [
            2.44993,
            2.4499,
            3.0127,
            0.54985
        ]
    }
]