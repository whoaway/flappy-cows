
const assetRoot = "/";
var objectSpeed = 5;
var gameTimer = 120;
var overlapPenalty_seconds = 10;

export class Scene extends Phaser.Scene {
    public sprites: {
        bg?: Phaser.GameObjects.TileSprite;
        plane?: Phaser.Physics.Arcade.Sprite;
        cow1?: Phaser.GameObjects.Sprite;
        cow2?: Phaser.GameObjects.Sprite;
        coin?: Phaser.GameObjects.Sprite;
        coin1?: Phaser.Physics.Arcade.Sprite;
        avatar?: Phaser.GameObjects.Sprite;
        timerbg?: Phaser.GameObjects.Sprite;
        timerbar?: Phaser.GameObjects.Sprite;
        timerclock?: Phaser.GameObjects.Sprite;
        cloud1?: Phaser.GameObjects.Sprite;
        cloud2?: Phaser.GameObjects.Sprite;
        cloud3?: Phaser.GameObjects.Sprite;
        bird1?: Phaser.GameObjects.Sprite;
        start_button?: Phaser.GameObjects.Sprite;
    } = {};
    public text: {
        score?: Phaser.GameObjects.Text;
        timer?: Phaser.GameObjects.Text;
    } = {};
    public images: {
        timerbarmask?: Phaser.GameObjects.Image;
    } = {};
    public score: number = 0;
    public currentGameTimer: number = gameTimer;
    public isrunning: boolean = false;
    public shakeable: boolean = true;
    public timerInterval: NodeJS.Timeout|null = null;
    public currentWidth: number = 1280;
    public currentHeight: number = 720;
    public timerbarInitialX: number = 0;
    public timerbarTimeoutX: number = 0;

    constructor({currentWidth, currentHeight}: {currentWidth: number, currentHeight: number}) {
        super({ key: "Scene" });
        this.currentWidth = currentWidth;
        this.currentHeight = currentHeight;
        this.timerbarInitialX = currentWidth / 2 - 5;
        this.timerbarTimeoutX = (currentWidth / 2 - 5) - 400;
    }


    preload() {
        this.load.image('plane-bg', assetRoot + 'plane-bg.jpg');
        this.load.image('cloud1', assetRoot + 'cloud1.png');
        this.load.image('cloud2', assetRoot + 'cloud2.png');
        this.load.image('cloud3', assetRoot + 'cloud3.png');
        this.load.image('plane', assetRoot + 'plane.png');
        this.load.image('button-start', assetRoot + 'button-start.png');
        this.load.image('cow-normal', assetRoot + 'cow-normal.png');
        this.load.image('coin', assetRoot + 'coin.png');
        this.load.image('avatar', assetRoot + 'avatar.png');
        this.load.image('timerbg', assetRoot + 'timerbg.png');
        this.load.image('timerbar', assetRoot + 'timerbar.png');
        this.load.image('timerclock', assetRoot + 'timerclock.png');
        this.load.image('bird', assetRoot + 'bird.png');
        this.load.image('cowNormal', assetRoot + 'cow-normal.png');
        this.load.image('cowStress', assetRoot + 'cow-stress.png');

    }

    create() {

        // add background
        this.sprites.bg = this.add.tileSprite(0, this.currentHeight, 3840, 720, 'plane-bg');
        this.sprites.bg.setOrigin(0, 1);

        // add plane
        this.sprites.plane = this.physics.add.sprite(this.currentWidth / 5, this.currentHeight / 2, "plane");
        this.sprites.plane.setScale(0.6);

        // add cows
        this.sprites.cow1 = this.add.sprite(this.sprites.plane.x - 10, this.sprites.plane.y, "cowNormal");
        this.sprites.cow2 = this.add.sprite(this.sprites.plane.x + 35, this.sprites.plane.y, "cowNormal");
        this.sprites.cow2.setScale(0.5);
        this.sprites.cow1.setScale(0.5);

        // add event listener for pointerdown on game scene
        this.input.on('pointerdown', () => {
            if (!this.isrunning) return;
            // move plane up
            (this.sprites.plane?.body as Phaser.Physics.Arcade.Body).setVelocityY(-200);
        });

        // add clouds
        this.sprites.cloud1 = this.add.sprite(this.currentWidth + Phaser.Math.Between(100, this.currentWidth), Phaser.Math.Between(100, this.currentHeight - 100), "cloud1");
        this.sprites.cloud2 = this.add.sprite(this.currentWidth + Phaser.Math.Between(100, this.currentWidth), Phaser.Math.Between(100, this.currentHeight - 100), "cloud2");
        this.sprites.cloud3 = this.add.sprite(this.currentWidth + Phaser.Math.Between(100, this.currentWidth), Phaser.Math.Between(100, this.currentHeight - 100), "cloud3");
        this.sprites.cloud1.setScale(0.5);
        this.sprites.cloud2.setScale(0.5);
        this.sprites.cloud3.setScale(0.5);

        // add coin
        this.sprites.coin1 = this.physics.add.sprite(this.currentWidth + Phaser.Math.Between(100, this.currentWidth), Phaser.Math.Between(100, this.currentHeight - 100), "coin");
        this.sprites.coin1.setScale(0.5);
        //prevents coin from falling
        (this.sprites.coin1.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        (this.sprites.coin1.body as Phaser.Physics.Arcade.Body).mass = 0;

        // add bird
        const birdPosX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
        const birdPosY = Phaser.Math.Between(100, this.currentHeight - 100);
        this.sprites.bird1 = this.add.sprite(birdPosX, birdPosY, "bird");
        this.sprites.bird1.setScale(0.5);

        // enable physics for plane and coin
        this.physics.world.enable([this.sprites.plane, this.sprites.coin1]);

        // add avatar
        const avatarPosX = this.currentWidth - 70;
        const avatarPosY = 62;
        this.sprites.avatar = this.add.sprite(avatarPosX, avatarPosY, "avatar");
        this.sprites.avatar.setScale(0.33);

        // add coin
        const coinPosX = this.currentWidth - 160;
        const coinPosY = 66;
        this.sprites.coin = this.add.sprite(coinPosX, coinPosY, "coin");
        this.sprites.coin.setScale(0.32);

        // add score text
        const scorePosX = this.currentWidth - 200;
        const scorePosY = 66;
        this.text.score = this.add.text(scorePosX, scorePosY, "0", { fontFamily: "Comic Sans MS", fontSize: 40, fontStyle: "bold", color: "white" });
        this.text.score.setFontStyle('bold');
        this.text.score.setOrigin(1, 0.5);

        // add timerbg
        const timerbgPosX = this.currentWidth / 2 - 20;
        const timerbgPosY = 62;
        this.sprites.timerbg = this.add.sprite(timerbgPosX, timerbgPosY, "timerbg");
        this.sprites.timerbg.setScale(0.35);

        // add timerbar
        const timerbarPosX = this.timerbarInitialX;
        const timerbarPosY = 62;
        this.sprites.timerbar = this.add.sprite(timerbarPosX, timerbarPosY, "timerbar");
        this.sprites.timerbar.setScale(0.35);

        // add timerbarmask
        this.images.timerbarmask = this.make.image({
            x: timerbarPosX,
            y: 62,
            key: "timerbar",
            add: false
        });
        this.images.timerbarmask.setScale(0.35);

        // apply mask to timerbar
        this.sprites.timerbar.mask = new Phaser.Display.Masks.BitmapMask(this, this.images.timerbarmask);

        // add timerclock
        const timerclockPosX = this.currentWidth / 2 - 218;
        const timerclockPosY = 58;
        this.sprites.timerclock = this.add.sprite(timerclockPosX, timerclockPosY, "timerclock");
        this.sprites.timerclock.setScale(0.35);

        // add timer text
        const timerTextPosX = this.currentWidth / 2;
        const timerTextPosY = 62;
        this.text.timer = this.add.text(timerTextPosX, timerTextPosY, "02:00", { font: "25px Arial", fontStyle: "bold", color: "white" });
        this.text.timer.setFontStyle('bold');
        this.text.timer.setOrigin(0.5);
        this.text.timer.setStroke("black", 6);

        // add sprite for start button
        const startButtonPosX = this.currentWidth / 2;
        const startButtonPosY = this.currentHeight / 2;
        this.sprites.start_button = this.add.sprite(startButtonPosX, startButtonPosY, "button-start");
        // enable interactions
        this.sprites.start_button.setInteractive();
        // add event listener for pointerdown
        this.sprites.start_button.on("pointerdown", () => {
            if (this.isrunning) return;
            this.startTheGame();
        });

        this.stopTheGame();
    }

    update() {
        if (!this.isrunning) return;
        //sync cow position with plane
        if (!this.sprites.cow1 || !this.sprites.cow2 || !this.sprites.plane) return;
        this.sprites.cow1.setPosition(this.sprites.plane.x - 10, this.sprites.plane.y);
        this.sprites.cow2.setPosition(this.sprites.plane.x + 35, this.sprites.plane.y);


        // update timer text
        if(!this.text.timer || !this.text.score) return;
        this.text.timer.text = this.secondsFormat(this.currentGameTimer);
        this.text.score.text = this.score.toString();

        // advance background
        if (!this.sprites.bg) return;
        this.sprites.bg.setTilePosition(this.sprites.bg.tilePositionX + 2);
        // move clouds closer to plane
        if (!this.sprites.cloud1 || !this.sprites.cloud2 || !this.sprites.cloud3) return;
        this.sprites.cloud1.setPosition(this.sprites.cloud1.x - objectSpeed, this.sprites.cloud1.y);
        this.sprites.cloud2.setPosition(this.sprites.cloud2.x - objectSpeed, this.sprites.cloud2.y);
        this.sprites.cloud3.setPosition(this.sprites.cloud3.x - objectSpeed, this.sprites.cloud3.y);
        // move coin closer to plane
        if (!this.sprites.coin1) return;
        this.sprites.coin1.setPosition(this.sprites.coin1.x - objectSpeed, this.sprites.coin1.y);
        // move bird closer to plane
        if (!this.sprites.bird1) return;
        this.sprites.bird1.setPosition(this.sprites.bird1.x - objectSpeed, this.sprites.bird1.y);

        // end game when out of bounds
        if (this.sprites.plane.y > this.currentHeight || this.sprites.plane.y < 0) {
            this.stopTheGame();
        }

        // reset clouds when out of bounds
        if (this.sprites.cloud1.x < -100) {
            const offsetX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
            const offsetY = Phaser.Math.Between(100, this.currentHeight - 100);
            this.sprites.cloud1.setPosition(offsetX, offsetY);
        }
        if (this.sprites.cloud2.x < -100) {
            const offsetX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
            const offsetY = Phaser.Math.Between(100, this.currentHeight - 100);
            this.sprites.cloud2.setPosition(offsetX, offsetY);
        }
        if (this.sprites.cloud3.x < -100) {
            const offsetX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
            const offsetY = Phaser.Math.Between(100, this.currentHeight - 100);
            this.sprites.cloud3.setPosition(offsetX, offsetY);
        }
        // reset coin when out of bounds
        if (this.sprites.coin1.x < -100) {
            const offsetX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
            const offsetY = Phaser.Math.Between(100, this.currentHeight - 100);
            this.sprites.coin1.setPosition(offsetX, offsetY);
        }
        // reset bird when out of bounds
        if (this.sprites.bird1.x < -100) {
            const offsetX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
            const offsetY = Phaser.Math.Between(100, this.currentHeight - 100);
            this.sprites.bird1.setPosition(offsetX, offsetY);
        }

        // get coin when plane is close to coin
        if (Phaser.Math.Distance.BetweenPoints(this.sprites.plane, this.sprites.coin1) < 100) {
            this.getCoin();
        }
        // shake game when plane is close to cloud
        if (!this.sprites.cloud1 || !this.sprites.cloud2 || !this.sprites.cloud3) return;
        const isOverlappingCloud = [this.sprites.cloud1, this.sprites.cloud2, this.sprites.cloud3].some(cloud => Phaser.Math.Distance.BetweenPoints(this.sprites.plane!, cloud) < 100);
        if (isOverlappingCloud) {
            this.shakeit();
        }
        // shake game when plane is close to bird
        const isOverlappingBird = [this.sprites.bird1].some(bird => Phaser.Math.Distance.BetweenPoints(this.sprites.plane!, bird) < 100);
        if (isOverlappingBird) {
            this.shakeit();
        }
    }

    startTheGame() {

        this.score = 0;
        this.isrunning = true;
        this.physics.world.enable([this.sprites.plane!, this.sprites.coin1!]);

        // hide start button
        if (!this.sprites.start_button) return;
        this.sprites.start_button.setAlpha(0.0001);
        this.sprites.start_button.setInteractive(false);

        // set plane position
        if (!this.sprites.plane) return;
        this.sprites.plane.setPosition(this.currentWidth / 5, this.currentHeight / 2);

        // set coin position
        if (!this.sprites.coin1) return;
        const coinX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
        const coinY = Phaser.Math.Between(100, this.currentHeight - 100);
        this.sprites.coin1.setPosition(coinX, coinY);

        // set timerbar position
        if (!this.sprites.timerbar) return;
        const timerbarPosX = this.timerbarInitialX;
        const timerbarPosY = 62;
        this.sprites.timerbar.setPosition(timerbarPosX, timerbarPosY);

        // set shakeable to true
        this.shakeable = true;

        // set currentGameTimer to gameTimer
        this.currentGameTimer = gameTimer;

        // clear timerInterval
        if (this.timerInterval) clearInterval(this.timerInterval);

        // set timerInterval
        this.timerInterval = setInterval(() => {

            // check if timer ran out
            if (this.currentGameTimer > 0) {
                this.currentGameTimer--;
                this.sprites.timerbar!.x -= (this.timerbarInitialX - this.timerbarTimeoutX) / Math.ceil(gameTimer);
            } else {
                // stop the game if timer ran out
                this.stopTheGame();
                alert("Time has run out!");
            }

        }, 1000);

    }

    stopTheGame() {
        this.isrunning = false;
        if (!this.sprites.plane || !this.sprites.coin1) return;
        this.physics.world.disable([this.sprites.plane, this.sprites.coin1]);
        // show start button
        if (!this.sprites.start_button) return;
        this.sprites.start_button.setAlpha(1);
        this.sprites.start_button.setInteractive(true);
        // clear timerInterval
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    secondsFormat(sc: number) {
        if (sc > 0) {
            let minutes = Math.floor(sc / 60);
            let str_minutes = this.padTo2Digits(minutes);
            let seconds = sc % 60;
            let str_seconds = this.padTo2Digits(seconds);
            return str_minutes + ":" + str_seconds;
    } else {
        return "00:00";
    }

}

    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    getCoin() {
        this.score += 10;
        if (!this.sprites.coin1) return;
        const coinX = this.currentWidth + Phaser.Math.Between(100, this.currentWidth);
        const coinY = Phaser.Math.Between(100, this.currentHeight - 100);
        this.sprites.coin1.setPosition(coinX, coinY);

}

    shakeit() {
        this.cameras.main.shake(50, 0.01);
        // set cow sprited to stressed
        if (!this.sprites.cow1 || !this.sprites.cow2) return;
        this.sprites.cow1.setTexture("cowStress");
        this.sprites.cow2.setTexture("cowStress");
        if (this.shakeable) {
        // decrement timer when shaken
        this.currentGameTimer -= overlapPenalty_seconds;
        // enable immmunity for 2 seconds
        this.shakeable = false;
        setTimeout(() => {
            this.shakeable = true;
        }, 2000);
        // reset sprites after 4 seconds
        setTimeout(() => {
            if (!this.sprites.cow1 || !this.sprites.cow2) return;
            this.sprites.cow1.setTexture("cowNormal");
            this.sprites.cow2.setTexture("cowNormal");
            }, 4000);
        }

}

}