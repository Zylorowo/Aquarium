import pgzrun
import random

punkte = 0
WIDTH = 800
HEIGHT = 500
timer = 20


fish = Actor("fish", (109, 100))
y = Actor("blowfish", (232, 305))
x = Actor("shark", (502, 268))
game = Actor("game", (500, 250))
fish_dir = 1
y_dir = 70
x_dir = 1

bubbles = []

for i in range(60):
    bubble = Actor(
        "bubble",
        (random.randint(1, WIDTH), random.randint(1, HEIGHT))
    )
    bubbles.append(bubble)

mullsacke = []

for i in range(6):
    mullsack = Actor(
        "mullsack",
        (random.randint(100, WIDTH), random.randint(100, HEIGHT))
    )
    mullsacke.append(mullsack)


def draw():



    screen.fill((10, 70, 120))

    x.draw()
    y.draw()
    fish.draw()

    for bubble in bubbles:
        bubble.draw()


    for mullsack in mullsacke:
        mullsack.draw()

    screen.draw.text("Punkte: " + str(punkte),
                     (10, 10),
                     color="white",
                     fontsize=30)

    screen.draw.text("Time: " + str(timer),
                     (10, 30),
                      color="white",
                     fontsize=30)




    if timer < 0.1:
        game.draw()
#        screen.draw.text("Punkte: " + str(timer),
 #                        (200, 150),
  #                       color="white",
   #                      fontsize=30)



def update():

    global timer

    if timer >0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001:
        timer -=1 /60



    global fish_dir, y_dir, x_dir

    fish.x += 3 * fish_dir

    if fish.x > WIDTH - 20:
        fish_dir = -2
        fish.image = "fish_left"

    if fish.x < 20:
        fish_dir = 2
        fish.image = "fish"

    y.x += 4 * y_dir

    if y.x > WIDTH - 20:
        y_dir = -2
        y.image = "blowfish_left"

    if y.x < 20:
        y_dir = 2
        y.image = "blowfish"


    x.x += 5 * x_dir

    if x.x > WIDTH - 20:
        x_dir = -5
        x.image = "shark_left"

    if x.x < 20:
        x_dir = 5
        x.image = "shark"

    for bubble in bubbles:
        bubble.y -= 2

        if bubble.y <= -20:
            bubble.y = HEIGHT
            bubble.x = random.randint(1, WIDTH)

    for mullsack in mullsacke:
        mullsack.y += 2

        if mullsack.y > HEIGHT + 20:
            mullsack.y = -20
            mullsack.x = random.randint(1, WIDTH)


def on_mouse_down(pos):
    global punkte

    if fish.collidepoint(pos):
        print("Normaler Fisch angeklickt!")
        punkte += 0.5
        return

    if y.collidepoint(pos):
        print("Kugelfisch angeklickt!")
        punkte += 1
        return

    if x.collidepoint(pos):
        print("Hai angeklickt!")
        punkte += 5
        return


    for mullsack in mullsacke:
        if mullsack.collidepoint(pos):
            print("Müllsack angeklickt!")
            punkte -= 10
            mullsack.x = 100
            mullsack.y =10000

    print("Nur Wasser angeklickt!")
    punkte -= 1


pgzrun.go()
