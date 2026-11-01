(function () {
  "use strict";
  // Verified from the authenticated Lincoln Christian Hudl report. Updated manually until a secure Hudl refresh path is configured.
  window.LincolnBasketball = { version: 1, data: {
    "girls-basketball": {
      teamName:"Lincoln Christian", season:"2026-27", games:1, checkedAt:"2026-11-01T18:45:00-05:00",
      source:"https://www.hudl.com/reports/teams/162299/stats", sourceName:"Hudl",
      roster:[["0","Ivey Wheeler"],["1","Lauren Still"],["3","Presli Roberts"],["4","Azariah Woodruff"],["12","Niya Willoby"],["20","Emery Wheeler"],["22","Leah Moore"],["25","Jayla Albert"],["31","Hayleigh Michalec"],["","Ellsie Holloway"],["","Emma Williams"],["","Layne Lovelle"],["","Noelle Lagow"],["","Reese Nelson"],["","Sally Pritchard"],["","Sam Lofstrom"]].map(function(p,i){return{id:"gb-hudl-"+i,number:p[0],name:p[1],grade:"",position:"",source:"Hudl"};}),
      team:{totals:{pf:29,pa:37,fgm:10,fga:22,fgPct:"45.5%",threeM:3,threeA:7,threePct:"42.9%",ftm:6,fta:12,ftPct:"50.0%",oreb:7,dreb:8,reb:15,ast:5,turnovers:11,steals:4,blocks:1,charges:0,fouls:11},averages:{ppg:29,papg:37,fgm:10,fga:22,fgPct:"45.5%",threeM:3,threeA:7,threePct:"42.9%",ftm:6,fta:12,ftPct:"50.0%",oreb:7,dreb:8,reb:15,ast:5,turnovers:11,steals:4,blocks:1,charges:0,fouls:11}},
      players:[
        {number:"0",name:"Ivey Wheeler",gp:1,pts:11,ppg:11,fgm:4,fga:7,fgPct:"57.1%",threeM:2,threeA:3,threePct:"66.7%",ftm:1,fta:1,ftPct:"100.0%",oreb:0,dreb:1,reb:1,ast:2,turnovers:2,steals:2,blocks:1,charges:0},
        {number:"1",name:"Lauren Still",gp:1,pts:0,ppg:0,fgm:0,fga:1,fgPct:"0.0%",threeM:0,threeA:1,threePct:"0.0%",ftm:0,fta:0,ftPct:"-",oreb:1,dreb:0,reb:1,ast:0,turnovers:1,steals:0,blocks:0,charges:0},
        {number:"4",name:"Azariah Woodruff",gp:1,pts:6,ppg:6,fgm:3,fga:5,fgPct:"60.0%",threeM:0,threeA:0,threePct:"-",ftm:0,fta:2,ftPct:"0.0%",oreb:3,dreb:1,reb:4,ast:1,turnovers:2,steals:2,blocks:0,charges:0},
        {number:"12",name:"Niya Willoby",gp:1,pts:7,ppg:7,fgm:2,fga:5,fgPct:"40.0%",threeM:1,threeA:2,threePct:"50.0%",ftm:2,fta:6,ftPct:"33.3%",oreb:1,dreb:3,reb:4,ast:2,turnovers:3,steals:0,blocks:0,charges:0},
        {number:"22",name:"Leah Moore",gp:1,pts:0,ppg:0,fgm:0,fga:0,fgPct:"-",threeM:0,threeA:0,threePct:"-",ftm:0,fta:0,ftPct:"-",oreb:1,dreb:0,reb:1,ast:0,turnovers:0,steals:0,blocks:0,charges:0},
        {number:"25",name:"Jayla Albert",gp:1,pts:5,ppg:5,fgm:1,fga:4,fgPct:"25.0%",threeM:0,threeA:1,threePct:"0.0%",ftm:3,fta:3,ftPct:"100.0%",oreb:0,dreb:3,reb:3,ast:0,turnovers:1,steals:0,blocks:0,charges:0},
        {number:"31",name:"Hayleigh Michalec",gp:1,pts:0,ppg:0,fgm:0,fga:0,fgPct:"-",threeM:0,threeA:0,threePct:"-",ftm:0,fta:0,ftPct:"-",oreb:0,dreb:0,reb:0,ast:0,turnovers:1,steals:0,blocks:0,charges:0}
      ]
    }
  }, forSport:function(sport){return this.data[sport]||null;} };
}());