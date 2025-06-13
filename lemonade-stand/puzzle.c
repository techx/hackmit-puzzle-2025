#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>
#include <fcntl.h>
#include <sys/sendfile.h>
#include <unistd.h>

#define LEMON_COST 0.10
#define SUGAR_COST 0.05
#define ICE_COST   0.02

#define BATCH_CUPS 10.0    

#define OPTIMAL_LEMONS 8
#define OPTIMAL_SUGAR  8
#define OPTIMAL_ICE    10
#define OPTIMAL_PRICE  0.35

#define MAX_CUSTOMERS 80
#define MIN_PRICE 0.10
#define MAX_PRICE 5.00

#define STRINGIFY(x) #x

typedef struct {
    int lemons, sugar, ice;
    double price;
} Recipe;

typedef struct {
    int demand;
    double revenue, cost, profit;
    int taste_score, value_score;
} DayResult;

typedef enum {
    MODE_ADMIN,
    MODE_DEBUG,
    MODE_NORMAL
} OperatingMode;

typedef struct __attribute__((packed)) {
    char log_buf[266];
    OperatingMode mode;
} DebugControl;

__attribute__((aligned(256)))
DebugControl g_debug_control = { .mode = MODE_NORMAL };

int ingredient_score(int amount, int optimal) {
    if (amount == 0) return 0;
    double deviation = fabs((double)amount / optimal - 1.0);
    int score = (int)(100.0 * exp(-deviation * 2.0));
    return score > 100 ? 100 : score;
}

int calculate_taste(const Recipe *r) {
    int ls = ingredient_score(r->lemons, OPTIMAL_LEMONS);
    int ss = ingredient_score(r->sugar,  OPTIMAL_SUGAR);
    int is = ingredient_score(r->ice,    OPTIMAL_ICE);
    int taste = (int)(ls * 0.5 + ss * 0.3 + is * 0.2);
    return taste > 100 ? 100 : taste;
}

int calculate_value(const Recipe *recipe, int taste_score) {
    const double price = recipe->price;

    const double k = 2.5;
    double price_attract =
        exp( -k * pow((price - OPTIMAL_PRICE) / OPTIMAL_PRICE, 2) );   // 0-1

    // double value_0_1 = 0.55 * price_attract + 0.45 * (taste_score / 100.0);
    double value_0_1 = 0.75 * price_attract + 0.25 * (taste_score / 100.0);

    int value = (int)round(value_0_1 * 100);
    if (value > 100) value = 100;
    if (value < 0)   value = 0;
    return value;
}

double cost_per_cup(const Recipe *r) {
    double raw = r->lemons * LEMON_COST +
                 r->sugar  * SUGAR_COST  +
                 r->ice    * ICE_COST;
    return raw / BATCH_CUPS;
}

int calculate_demand(int taste, int value) {
    double factor = (taste / 100.0) * pow(value / 100.0, 3.0);
    int d = (int)(factor * MAX_CUSTOMERS);
    return d > MAX_CUSTOMERS ? MAX_CUSTOMERS : d;
}

DayResult simulate_day(const Recipe *r) {
    DayResult res;
    res.taste_score = calculate_taste(r);
    res.value_score = calculate_value(r, res.taste_score);
    res.demand      = calculate_demand(res.taste_score, res.value_score);

    double cpu = cost_per_cup(r);
    res.revenue = res.demand * r->price;
    res.cost    = res.demand * cpu;
    res.profit  = res.revenue - res.cost;
    return res;
}

void print_ai_analysis(const Recipe *r, DayResult d, const char *name) {
    printf("\n🤖 AI ANALYSIS FOR %s 🤖\n", name);
    printf("=====================================\n");
    
    // Recipe analysis
    printf("Recipe Intelligence: ");
    if (r->lemons > 15 || r->sugar > 15) {
        printf("EXTREME RECIPE ALERT! ");
        printf("Your customers might need medical attention! 😵\n");
    } else if (r->lemons < 3 || r->sugar < 2) {
        printf("Is this lemonade or just... water? ");
        printf("The flavor is in witness protection! 🕵️\n");
    } else if (r->lemons >= 8 && r->lemons <= 12 && r->sugar >= 6 && r->sugar <= 10) {
        printf("Perfect balance detected! ");
        printf("You have achieved lemonade enlightenment! 🍋✨\n");
    } else {
        printf("Decent recipe, but room for improvement! ");
        printf("The ingredients are cautiously optimistic! 🍋\n");
    }
    
    // Price analysis
    printf("Pricing Wisdom: ");
    if (r->price > 3.00) {
        printf("PREMIUM PRICING DETECTED! ");
        printf("Are you selling liquid gold or lemonade? 💰\n");
    } else if (r->price < 0.25) {
        printf("Charity mode activated! ");
        printf("Even the pigeons feel bad for you. 🐦💸\n");
    } else if (r->price >= 0.75 && r->price <= 1.50) {
        printf("Smart pricing strategy! ");
        printf("The invisible hand of the market approves! 👍\n");
    } else {
        printf("Pricing needs some fine-tuning! ");
        printf("The market is confused but trying to be polite. 🤷\n");
    }
    
    // Performance analysis
    printf("\nPerformance Report:\n");
    
    if (d.taste_score >= 80) {
        printf("👨‍🍳 TASTE MASTER! Your lemonade is basically liquid sunshine!\n");
    } else if (d.taste_score >= 60) {
        printf("😋 Pretty tasty! Customers are cautiously optimistic!\n");
    } else if (d.taste_score >= 40) {
        printf("🤔 Mediocre flavor alert! It's... drinkable?\n");
    } else {
        printf("💀 TASTE DISASTER! Even the flies are concerned!\n");
    }
    
    if (d.value_score >= 80) {
        printf("💎 INCREDIBLE VALUE! Customers think they're stealing from you!\n");
    } else if (d.value_score >= 60) {
        printf("👍 Fair deal! Wallets and taste buds are both satisfied!\n");
    } else if (d.value_score >= 40) {
        printf("💸 Overpriced much? Customers checking their math twice!\n");
    } else {
        printf("🏃‍♂️ OVERPRICED ALERT! Customers running away with their money!\n");
    }
    
    // Profit analysis with personality
    printf("\nBottom Line Analysis:\n");
    if (d.profit > 5.00) {
        printf("💰 PROFIT MACHINE! %s is printing money like the Federal Reserve!\n", name);
        printf("   Warren Buffett wants to invest in your lemonade empire!\n");
    } else if (d.profit > 2.00) {
        printf("📈 SOLID PROFITS! %s is on the path to lemonade domination!\n", name);
        printf("   You're making bank, one cup at a time!\n");
    } else if (d.profit > 0) {
        printf("💵 MODEST GAINS! %s is keeping the lights on!\n", name);
        printf("   Hey, profit is profit! Rome wasn't built in a day!\n");
    } else if (d.profit == 0) {
        printf("⚖️  BREAKING EVEN! %s is perfectly balanced, as all things should be!\n", name);
        printf("   You're not losing money, which is... something!\n");
    } else {
        printf("📉 MONEY PIT ALERT! %s is hemorrhaging cash!\n", name);
        printf("   Time to either pivot or find a day job! 💼\n");
    }
    
    // Final AI wisdom
    printf("\n🔮 AI PREDICTION: ");
    if (d.taste_score > 70 && d.value_score > 70) {
        printf("Future lemonade tycoon detected! 🏆\n");
    } else if (d.demand > 15) {
        printf("The people love %s! Keep up the good work! 🎉\n", name);
    } else if (d.profit > 0) {
        printf("You're on the right track! Small tweaks = big gains! 🔧\n");
    } else {
        printf("Every failure is a learning opportunity! 📚\n");
    }
    
    printf("=====================================\n\n");
}

void print_results(const Recipe *r, DayResult d) {
    printf("Recipe: %2d lemons, %2d sugar, %2d ice, $%.2f\n",
           r->lemons, r->sugar, r->ice, r->price);
    printf("Taste:  %3d/100   Value: %3d/100\n",
           d.taste_score, d.value_score);
    printf("Cust:   %2d        Rev:  $%.2f\n", d.demand, d.revenue);
    printf("Cost:   $%.2f      Profit: $%.2f\n", d.cost, d.profit);
    puts("----------------------------");
}

int main(void) {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);

    #define SLOTS 16
    char *names[SLOTS] = {NULL};
    Recipe recipes[SLOTS] = {0};

    while (1) {
        printf("enter command: ");
        char cmd[128];
        scanf("%127s", cmd);

        // Usage: stand_create <index> <name_len> <name>
        if (strcmp(cmd, "stand_create") == 0) {
            int index;
            if (scanf("%127s", cmd) != 1 || (index = atoi(cmd)) < 0 || index >= SLOTS) {
                printf("invalid index\n");
                return 1;
            }

            int size;
            if (scanf("%127s", cmd) != 1 || (size = atoi(cmd)) <= 0 || size > 1024) {
                printf("invalid length\n");
                return 1;
            }

            names[index] = malloc(size + 1);
            if (!names[index]) {
                perror("malloc");
                return 1;
            }

            char fmt[16];
            snprintf(fmt, sizeof(fmt), "%%%ds", size);
            if (scanf(fmt, names[index]) != 1) {
                printf("failed to read name");
                return 1;
            }

            continue;
        }

        if (strcmp(cmd, "stand_rename") == 0) {
            int index;
            if (scanf("%127s", cmd) != 1 || (index = atoi(cmd)) < 0 || index >= SLOTS) {
                printf("invalid index\n");
                return 1;
            }

            size_t size = malloc_usable_size(names[index]);
            if (size == 0) {
                printf("failed to rename\n");
                return 1;
            }

            char fmt[32];
            snprintf(fmt, sizeof(fmt), "%%%lds", size);
            if (scanf(fmt, names[index]) != 1) {
                printf("failed to read name");
                return 1;
            }

            continue;
        }

        // Usage: stand_delete <index>
        if (strcmp(cmd, "stand_delete") == 0) {
            int index;
            if (scanf("%127s", cmd) != 1 || (index = atoi(cmd)) < 0 || index >= SLOTS) {
                printf("invalid index\n");
                return 1;
            }
            if (names[index] != NULL) {
                free(names[index]);
            }
            memset(&recipes[index], 0, sizeof(Recipe));

            continue;
        }

        // Usage: set_recipe <index> <lemons> <sugar> <ice> <price>
        if (strcmp(cmd, "set_recipe") == 0) {
            int index;
            if (scanf("%127s", cmd) != 1 || (index = atoi(cmd)) < 0 || index >= SLOTS) {
                puts("invalid index\n");
                return 1;
            }

            Recipe *user = &recipes[index];
            if (
                scanf("%127s", cmd) != 1 ||
                (user->lemons = atoi(cmd) < 0) || user->lemons > 100 ||
                scanf("%127s", cmd) != 1 ||
                (user->sugar = atoi(cmd) < 0) || user->sugar > 100 ||
                scanf("%127s", cmd) != 1 ||
                (user->ice = atoi(cmd) < 0) || user->ice > 100 ||
                scanf("%127s", cmd) != 1 ||
                (user->price = atof(cmd) < MIN_PRICE) || user->price > MAX_PRICE
            ) {
                puts(
                    "invalid recipe (ingredients must be 0-100 and price must be $"
                    STRINGIFY(MIN_PRICE) "-$" STRINGIFY(MAX_PRICE)
                    "\n"
                );
                return 1;
            }

            continue;
        }

        // Usage: simulate <index>
        if (strcmp(cmd, "simulate") == 0) {
            int index;
            if (scanf("%127s", cmd) != 1 || (index = atoi(cmd)) < 0 || index >= SLOTS) {
                puts("invalid index\n");
                return 1;
            }

            char *name = names[index];
            if (name == NULL) {
                puts("stand doesn't exist");
                return 1;
            }
            Recipe *user = &recipes[index];

            printf("\nResults for %s Lemonade Stand: \n", name);
            DayResult r = simulate_day(user);
            print_results(user, r);
            print_ai_analysis(user, r, name);

            continue;
        }

        if (strcmp(cmd, "send_flag") == 0) {
            if (g_debug_control.mode != MODE_ADMIN) {
                puts("access denied");
                return 1;
            }
            fputs("flag: ", stdout);
            int fd = open("flag", O_RDONLY);
            if (fd == -1) {
                perror("open");
                return 1;
            }
            if (sendfile(STDOUT_FILENO, fd, 0, 0x1000) == -1) {
                perror("sendfile");
            }
            continue;
        }

        if (strcmp(cmd, "quit") == 0) {
            return 0;
        }

        puts("invalid command\n");
        return 1;
    }
}
