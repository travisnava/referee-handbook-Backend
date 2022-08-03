-- CREATE USER TABLE-------------
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(250) NOT NULL UNIQUE CHECK(POSITION('@' IN email) > 1),
    username    VARCHAR(250) NOT NULL UNIQUE,
    password    VARCHAR(250) NOT NULL,
    first_name  VARCHAR(250) NOT NULL,
    last_name   VARCHAR(250) NOT NULL,
    location    VARCHAR(250) NOT NULL,
    profile_image_URL VARCHAR(250),
    pw_reset_token TEXT,
    pw_reset_token_exp TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);



-------------------  CREATE BEGINNER COURSES ----------------------
CREATE TABLE BeginnerCourses (
    id                          SERIAL PRIMARY KEY,
    sport_name                  VARCHAR(500) NOT NULL,
    beginner_history_timeline   VARCHAR(1000) NOT NULL,
    beginner_rules              VARCHAR(5000) NOT NULL,
    beginner_short_description  VARCHAR(1500) NOT NULL,
    beginner_cover_image_URL    VARCHAR(500) NOT NULL,
    beginner_tutorial_video_URL VARCHAR(1000) NOT NULL,
    beginner_field_diagram_URL  VARCHAR(500) NOT NULL,
    created_at                  TIMESTAMP NOT NULL DEFAULT NOW()
);



------------------------CREATE ALL USER CREATED COURSES-----------------------------------------------------
CREATE TABLE UserCreatedCourses (
    id                          SERIAL PRIMARY KEY,
    sport_name                  VARCHAR(5000) NOT NULL,
    user_id                     INTEGER NOT NULL,
    course_title                VARCHAR(5000) NOT NULL,
    course_short_description    VARCHAR(5000) NOT NULL,
    course_cover_image_URL 	    VARCHAR(5000)  NOT NULL,
    course_content              VARCHAR(5000) NOT NULL,
    course_tips_tricks          VARCHAR(5000) NOT NULL,
    difficulty                  VARCHAR(5000) NOT NULL,
    course_tutorial_video_URL   VARCHAR(5000),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at                  TIMESTAMP NOT NULL DEFAULT NOW()
);


----------------------------CREATE RATINGS TO STORE A RATING FROM EACH USER FOR A SPECIFIC USER CREATED COURSE-----------
CREATE TABLE ratings (
    rating INTEGER NOT NULL CHECK (rating > 0 AND rating <= 5),
    course_id INTEGER NOT NULL REFERENCES UserCreatedCourses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, user_id)



);


------------------------CREATE ALL USER FOLLOWING ACTIVITY-----------------------------------------------------
CREATE TABLE UsersFollowingTeam (
    id                          SERIAL PRIMARY KEY,
    team_name                   VARCHAR(250) NOT NULL,
    team_logo                   VARCHAR(250) NOT NULL,
    team_id                     INTEGER NOT NULL,
    team_league                 VARCHAR(250) NOT NULL,
    team_sport_name             VARCHAR(250) NOT NULL,
    user_id                     INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    following_at                TIMESTAMP NOT NULL DEFAULT NOW()
);















---------------SEED ALL BEGINNER COURSE DATA--------------------

INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (1, 
        'Soccer', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1fw5JoZ32k1MHvxfKkytrN4OFl5lMguSk9hz90wBBBwg&font=Default&lang=en&initial_zoom=2', 
        '{b} A match consists of two 45 minutes halves with a 15 minute rest period in between.  
            {b} Each team can have a minimum off 11 players (including 1 goalkeeper who is the only player allowed to handle the ball within the 18 yard box) and a minimum of 7 players are needed to constitute a match.
            {b} The field must be made of either artificial or natural grass. The size of pitches is allowed to vary but must be within 100-130 yards long and 50-100 yards wide. The pitch must also be marked with a rectangular shape around the outside showing out of bounds, two six yard boxes, two 18 yard boxes and a centre circle. A spot for a penalty placed 12 yards out of both goals and centre circle must also be visible.
            {b} The ball must have a circumference of 58-61cm and be of a circular shape.
            {b} Each team can name up to 7 substitute players. Substitutions can be made at any time of the match with each team being able to make a maximum of 3 substitutions per side. In the event of all three substitutes being made and a player having to leave the field for injury the team will be forced to play without a replacement for that player.
            {b} Each game must include one referee and two assistant referee`s (linesmen). It`s the job of the referee to act as time keeper and make any decisions which may need to be made such as fouls, free kicks, throw ins, penalties and added on time at the end of each half. The referee may consult the assistant referees at any time in the match regarding a decision. It`s the assistant referee`s job to spot offside`s in the match (see below), throw ins for either team and also assist the referee in all decision making processes where appropriate.
            {b} If the game needs to head to extra time as a result of both teams being level in a match then 30 minutes will be added in the form of two 15 minute halves after the allotted 90 minutes.
            {b} If teams are still level after extra time then a penalty shootout must take place.
            {b} The whole ball must cross the goal line for it to constitute as a goal.
            {b} For fouls committed a player could receive either a yellow or red card depending on the severity of the foul; this comes down to the referee`s discretion. The yellow is a warning and a red card is a dismissal of that player. Two yellow cards will equal one red. Once a player is sent off then they cannot be replaced.
            {b} If a ball goes out of play off an opponent in either of the side lines then it is given as a throw in. If it goes out of play off an attacking player on the base line then it is a goal kick. If it comes off a defending player it is a corner kick.', 
        'Football (Soccer) is one of the oldest sports in the world and with that; it`s also one of the most recognised. The pinnacle of the international game comes in the form the Football World Cup.  Domestically the strongest leagues come from England (English Premier League), Spain (La Liga), Italy (Serie A) and Germany (Bundesliga). ', 
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80', 
        'https://www.youtube.com/embed/qknP-E-vPQ4', 
        'https://www.soccerdrive.com/sites/SoccerDrive2-0/files/soccer-field-diagram-with-lines.jpg' );

INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (2, 
        'Basketball', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1PvgbDApRf6SEUkAU97myrVse_20EzCEO_HRtsETwceM&font=Default&lang=en&initial_zoom=2', 
        '{b} Each team can have a maximum of 5 players on the court at any one time. Substitutions can be made as many times as they wish within the game.
            {b} The ball can only be moved by either dribbling (bouncing the ball) or passing the ball. Once a player puts two hands on the ball (not including catching the ball) they cannot then dribble or move with the ball and the ball must be passed or shot.
            {b} After the ball goes into a team`s half and they win possession back the ball must then make it back over the half way line within 10 seconds. If the ball fails to do so then a foul will be called and the ball will be turned over.
            {b} Each team has 24 seconds to at least shot at the basket. A shot constitutes either going in the basket or hitting the rim of the basket. If after the shot is taken and the ball fails to go in the basket then the shot clock is restarted for another 24 seconds.
            {b} The team trying to score a basket is called the offence whilst the team trying to prevent them from scoring is called the defence. The defence must do all they can to stop the offence from scoring by either blocking a shot or preventing a shot from being fired.
            {b} After each successful basket the ball is then turned over to the opposition.
            {b} Fouls committed throughout the game will be accumulated and then when reached a certain number will be eventually be awarded as a free throw. A free throw involves one playerfrom the offensive team (the player fouled) to take a shot unopposed from the free throw line. Depending on where the foul was committed will depend on the number free throws a player gets.
            {b} Violations in basketball include travelling (taking more than one step without bouncing the ball), double dribble (picking the ball up dribbling, stopping then dribbling again with two hands), goaltending (a defensive player interferes with the ball travelling downwards towards the basket) and back court violation (once the ball passes the half way line the offensive team cannot take the ball back over the half way line).', 
        'Basketball dates back as far as 1891 and since then has evolved into a sport played around the world. Many countries have adopted the game such as Russia, Great Britain, Germany, Spain and parts of Asia, but it is America where the biggest and most lucrative league in the world lives: the NBA (National Basketball Association).', 
        'https://images.unsplash.com/photo-1641133106402-cb7ab676b7bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80', 
        'https://www.youtube.com/embed/F6VLIExnc7Q', 
        'https://www.harrodsport.com/uploads/wysiwyg/img/basketball-court-dimensions-and-markings-in-feet-720x444.png' );

INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (3, 
        'Baseball', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1_xfC4oYD7mlNwhoZ60_lDqWpPqBR4fyCzeXhZ_qdEhk&font=Default&lang=en&initial_zoom=2', 
        '{b} Baseball has two teams of 9 players.
            {b} The fielding team`s positions are made up of a pitcher, catcher, first baseman, second baseman, shortstop, third baseman, and three outfielders at left field, centre field and right field.
            {b} Games last for 9 innings of which both teams get to bat once. If the game is a tie after 9 innings then an extra inning will be added until a winner is found. If the team batting second in the bottom of the 9th inning are already ahead in points, then they do not need to complete their batting innings.
            {b} Once a batting order is picked, then it cannot be changed throughout the game. Substitutes are permitted, however, they must bat in the order of the previous player whom they replaced.
            {b} If the batter manages to hit the ball from the pitcher, they must make an effort to at least get to first base. They can then run to as many bases as they wish before being tagged out. Each base must be touched with some part of the batters body when running past.
            {b} A batter gets up to three strikes before getting out. A strike is deemed when a batter swings for a ball and misses it. The batter can leave the ball but, if it`s within a certain area (called the strike zone), then a strike will also be given. If four balls miss the strike zone and the batter does not swing their bat, they can walk to first base.
            {b} When on base, the batter can run to the next base at any point.
            {b} Players can be dismissed by either a strike out (referring to a batsman missing the ball three times), force out (when a player fails to make the base before the defensive player), fly out (when the ball is hit in the air and caught without it bouncing), and tag outs (where a defensive player with the ball tags the batsman with the ball all whilst they are running).', 
        'Baseball is a sport that dates back as far as 1744 and formats of the game have been in place until the modern era today. The game is predominantly big in North America, Canada and Japan. The game is played worldwide with the pinnacle of sport coming from the World Series of Baseball. Ironically, this event is only competed by North American teams.', 
        'https://images.unsplash.com/photo-1578432014316-48b448d79d57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80', 
        'https://www.youtube.com/embed/I8VGW0C_GO4', 
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Baseball_positions.svg/2256px-Baseball_positions.svg.png' );



INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (4, 
        'Hockey', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1y5cOLs1BzmvIBckDV1GTZFyhnT4hLxRdkQJcT_zxKcg&font=Default&lang=en&initial_zoom=2', 
        '{b} The game starts in the centre circle with a face off. This is where the referee drops the puck in between two opposing players who then scrap to win position for their team. A faceoff may also be used to resume play after a stoppage in any of the attacking or defending face off zones.
            {b} Players may use physical force to win the puck off their opponent. Body checking can be used but is not prohibited in the back or above shoulder height.
            {b} Players who are imposed to have committed a minor penalty will be ordered to leave the ice for two minutes and their team play with 5 players for that duration. If the opposing team score a goal within those two minutes then that player can return to the rink immediately.
            {b} A minor penalty can include tripping an opponent with their stick, holding with either their stick or hands, hooking with their stick or body checking a player without the puck.
            {b} Major penalties will result in a player being removed from the ice for up to 5 minutes. These may include fighting, inflicting serious injury on opposing players or continued minor violations.', 
        'The origins of ice hockey date back to the 19th century in Canada where adaptations of the modern day hockey game were played in icy conditions. Since then the sport has gone on to become one of the largest in the world with the major participants originating from North America. The NHL (National Hockey League) is the largest league in the world.', 
        'https://images.unsplash.com/photo-1578535230289-3935f0a945f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80', 
        'https://www.youtube.com/embed/H_70vAiyyXM', 
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ice_hockey_layout.svg/1200px-Ice_hockey_layout.svg.png' );

INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (5, 
        'Volleyball', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1r10YN6UYeytDANLa29ZbUmJr8eyyh1FzkQ4ttM0R0j8&font=Default&lang=en&initial_zoom=2', 
        '{b} Each team consist of 6 players and 6 substitutes. Players can be substituted at any time but if they are to return can only be swapped for the player that replaced them.
         {b} Each team can hit the ball up to three times before the ball must be returned. The defensive team can then try and block or return the ball again hitting it a maximum of three times.
         {b} Games are played up to 25 points and must be won by 2 clear points.
         {b} Violations will be called for the following:
            {b} Stepping over the base line when serving the ball.
            {b} Ball hits the net and fails to get over the net (If the ball hits the net and still goes over the net then this is perfectly legal).
            {b} Players are not allowed to carry, palm or run with the ball.
            {b} Players must not touch the net with any part of the body. If the net is said to have hit them rather than vice-versa, then this is ok.
            {b} The ball cannot travel under the net.
            {b} Players cannot reach over the net and hit the ball.', 
        'Variations of the game volleyball have been in circulation since around 1895. The game has evolved since then and it was in 1964 where the sport entered its first Olympic games. The sport now has a global following with nations from around the world professionally competing. The pinnacle of the sport comes in the Olympic Games were the best players are often on show.',
        'https://images.unsplash.com/photo-1553005746-9245ba190489?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80', 
        'https://www.youtube.com/embed/9YvP2-YbIFs', 
        'https://homenish.com/wp-content/uploads/2021/05/Indoor-Volleyball-Court-Dimensions.jpg');

INSERT INTO BeginnerCourses (id, sport_name, beginner_history_timeline, beginner_rules, beginner_short_description, beginner_cover_image_URL, beginner_tutorial_video_URL, beginner_field_diagram_URL)
VALUES (6, 
        'Rugby', 
        'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1NclXnX1YRZfUlWjanC8edc5iYcZYmMBVMIegMKrs3og&font=Default&lang=en&initial_zoom=2', 
        '{b} The game is broken down into two 40 minute halves with a 10 minute rest period in between. The game carries no stoppage time and will end exactly on 80 minutes.
            {b} Each team can start with 15 players and up to 7 substitutes. Players that have left the field are only allowed to return if they have been treated for an injury.
            {b} The field must be roughly 100 metres long and 70 metres wide with a minimum of a 10 metre dead ball area. The H shaped goal needs to be 6 metres wide with no restrictions on height.
            {b} The field consist of the following markings; half way line, 5 metre line, 22 metre line, 10 metre line and dead ball line. Also included is a centre spot for restarting the game after a try, penalty or drop goal has been scored.
            {b} The game must have one referee and two touch judges. It`s the referee`s job to time keep, make decisions throughout the game and keep order on the field. The two touch judges can assist the referee with decisions and also notify the referee when players are in touch (out of playing boundaries).
            {b} The game will stop if a player is fouled, the ball goes out of play or a try or drop goal is scored.
            {b} The defending team must tackle a player by grabbing a hold and pulling them to the floor. A tackle cannot be made above shoulder height and doing so will cause the referee to award a foul.
            {b} Once the ball goes into touch a line out is called. Up to 7 players can enter a line out and any of these players can be lifted in order to catch the ball being thrown in. Both teams can compete to win the ball.
            {b} A successful conversion, penalty or kick at goal only occurs when the player manages to kick the ball through the top section of the goal. If a player is unsuccessful the ball is still in play until it crosses one of the playing fields boundaries.
            {b} Attacking players must remain behind the ball whilst active or run the risk of being called offside. Players not interfering with play can be in front of ball but must get back behind the ball before then again interfering with play.', 
        'Rugby is one of the most physical of sports. Internationally the pinnacle of the sport lies in the Rugby World Cup. Other tournaments such as the Tri Nations (including South Africa, New Zealand and Australia), Six Nations (including England, Ireland, Scotland, Wales, Italy and France) and the Heineken Cup are other tournaments which are held in high esteem throughout.', 
        'https://images.unsplash.com/photo-1574618471715-61c6b64aaf31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80', 
        'https://www.youtube.com/embed/F22A_V77Tic', 
        'https://i0.wp.com/texasrugbyunion.com/wp-content/uploads/2015/09/Technical-Zones-Diagram-rugby-field.png?ssl=1' );







----------SEED DATA INTO USERS TABLE FOR DEMO/POD SYNC PURPOSES-------------------------------

INSERT INTO users (id, email, username, password, first_name, last_name, location)
VALUES (0,
        'doug@case.io',
        'dogcage',
        'pw',
        'Doug',
        'Case',
        'Pleasanton, CA');






----------SEED DATA INTO USER CREATED COURSES FOR DEMO/POD SYNC PURPOSES-------------------------------

INSERT INTO UserCreatedCourses (id, sport_name, user_id, course_title, course_short_description, course_cover_image_URL, course_content, course_tutorial_video_URL, course_tips_tricks, difficulty)
VALUES (-2,
        'Basketball',
        0,
        'How to Shoot Like Steph',
        'This course will teach you how to step up your game and shoot like the legendary Golden State Warriors player, Stephen Curry.',
        'https://i.ytimg.com/vi/nDMDOZW6rPs/maxresdefault.jpg',
        'Curry is a right handed shooter, so in order to align his right side, he turns his feet slightly towards the left. Sometimes, off the dribble, his feet point directly at the rim. When this happens, he rotates his hips as he jumps, and turns in the air to maintain that alignment.',
        'https://www.youtube.com/watch?v=nDMDOZW6rPs',
        'By shooting with a high arc, Curry improves the angle of the ball`s path as it approaches the rim.',
        'Collegiate'
        );

INSERT INTO UserCreatedCourses (id, sport_name, user_id, course_title, course_short_description, course_cover_image_URL, course_content, course_tutorial_video_URL, course_tips_tricks, difficulty)
VALUES (-1,
        'Basketball',
        0,
        'How to Play Like Lebron',
        'This course will teach you how to take your game to the next level and start playing like legendary Lakers player, Lebron James.',
        'https://grottonetwork.com/wp-content/uploads/2019/01/how-to-play-life-like-lebron-james-plays-basketball.jpg',
        'In order to play like Lebron, it is important to master your court vision and playing with authority. Lebron is deadly on the fast break, and is able to finish at the rim with strength, and this is thanks to all of his hard work at the gym.',
        'https://www.youtube.com/watch?v=QcscsvbplIg',
        'Lebron stresses how important it is to also spend time in the gym to become faster and stronger, instead of only focusing on your basketball skills in the court.',
        'Professional'
        );

INSERT INTO UserCreatedCourses (id, sport_name, user_id, course_title, course_short_description, course_cover_image_URL, course_content, course_tutorial_video_URL, course_tips_tricks, difficulty)
VALUES (0,
        'Soccer',
        0,
        'How to Dribble Like Messi',
        'This course will teach you how to dribble like the legendary Barcelona wing, Lionel Messi.',
        'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt2b037240b3a9bfb8/60db78ae5e51ad3b1d265ab2/f929b881fd0ec7504316cd59d510677df2751c83.jpg',
        'The first three steps after your first touch are the most important factor in deciding if you will be able to keep control of the ball in your dribble. You want to make sure your first touch lays the ball perfectly infront of you and slows the ball down significantly.',
        'https://www.youtube.com/watch?v=IYQfrAf7HFc',
        'It is important to keep the ball close at all times, and to keep your head up as you move the ball.',
        'Amateur'
        );




