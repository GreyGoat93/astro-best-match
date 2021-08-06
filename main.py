from selenium import webdriver
PATH = "C:\Program Files\chromedriver.exe"
driver = webdriver.Chrome(PATH)

# Location of birth
lat_hour = 41
lat_minute = 1
lon_hour =  28
lon_minute = 57

# Our birth time
our_day = 31
our_month = 12
our_year = 2001
our_hour = 23
our_minute = 52

# Starts from here
search_day = 27
search_month = 12
search_year = 2000

# Finished at here
search_day_finish = 5
search_month_finish = 1
search_year_finish = 2001

# Days of months. // February is set 28 due to my laziness lol
month_days = {
    "1": 31,
    "2": 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31,
    "9": 30,
    "10": 31,
    "11": 30,
    "12": 31,
}

# When current and finish dates are the same, this will be True
is_search_finished = False

# "Creating link by date" abstraction
def linkize(day, month, year):
    return f"https://horoscopes.astro-seek.com/calculate-love-compatibility/?send_calculation=1&muz_narozeni_den={our_day}&muz_narozeni_mesic={our_month}&muz_narozeni_rok={our_year}&muz_narozeni_hodina={our_hour}&muz_narozeni_minuta={our_minute}&muz_narozeni_city=&muz_narozeni_mesto_hidden=&muz_narozeni_stat_hidden=&muz_narozeni_podstat_kratky_hidden=&muz_narozeni_podstat_hidden=&muz_narozeni_input_hidden=&muz_narozeni_podstat2_kratky_hidden=&muz_narozeni_podstat3_kratky_hidden=&muz_narozeni_sirka_stupne={lat_hour}&muz_narozeni_sirka_minuty={lat_minute}&muz_narozeni_sirka_smer=0&muz_narozeni_delka_stupne={lon_hour}&muz_narozeni_delka_minuty={lon_minute}&muz_narozeni_delka_smer=0&muz_narozeni_timezone_form=auto&muz_narozeni_timezone_dst_form=auto&send_calculation=1&zena_narozeni_den=${day}&zena_narozeni_mesic=${month}&zena_narozeni_rok=${year}&zena_narozeni_hodina=00&zena_narozeni_minuta=00&zena_narozeni_no_cas=on&zena_narozeni_city=&zena_narozeni_mesto_hidden=&zena_narozeni_stat_hidden=XX&zena_narozeni_podstat_kratky_hidden=&zena_narozeni_podstat_hidden=&zena_narozeni_input_hidden=&zena_narozeni_podstat2_kratky_hidden=&zena_narozeni_podstat3_kratky_hidden=&zena_narozeni_sirka_stupne=${lat_hour}&zena_narozeni_sirka_minuty=${lat_minute}&zena_narozeni_sirka_smer=0&zena_narozeni_delka_stupne=${lon_hour}&zena_narozeni_delka_minuty=${lon_minute}&zena_narozeni_delka_smer=0&zena_narozeni_timezone_form=auto&zena_narozeni_timezone_dst_form=auto&switch_interpretations=3&house_system=placidus&hid_fortune=1&hid_fortune_check=on&hid_vertex=1&hid_vertex_check=on&hid_chiron=1&hid_chiron_check=on&hid_lilith=1&hid_lilith_check=on&hid_uzel=1&hid_uzel_check=on&uhel_orbis=&hide_aspects=0#tabs_redraw"

# Move on to next day
def nextDay():
    global search_year
    global search_month
    global search_day
    if(search_day == month_days[str(search_month)]):
        if(search_day == 31 and search_month == 12):
            search_day = 1
            search_month = 1
            search_year += + 1
        else:
            search_day = 1
            search_month += 1
    else:
        search_day += 1

# Functions name describes it
def checkIfFinished():
    if(search_day == search_day_finish and search_month == search_month_finish and search_year == search_year_finish):
        return True
    else:
        return False

def findAspectCount(text):
    index = text.find("x")
    return int(text[0:index])

def getAspectText(aspect, exact):
    whichElement = 0 if exact == True else 1
    text = "Error"
    aspectKey = ""
    if(aspect == "Loving"):
        aspectKey = 'Loving'
    elif(aspect == "Key"):
        aspectKey = 'Key aspect'
    elif(aspect == "Passion"):
        aspectKey = 'Amor'
    elif(aspect == "Emotional Pain"):
        aspectKey = 'Tears'
    elif(aspect == "Easy"):
        aspectKey = 'Easy'
        whichElement = 0 if exact == True else 2
    elif(aspect == "Conflict"):
        aspectKey = "Struggle"
        whichElement = 0 if exact == True else 2
    elif(aspect == "Combination"):
        aspectKey = "Easy"
        whichElement = 1 if exact == True else 3
    text = driver.find_elements_by_css_selector(f"img[alt='{aspectKey}'].smajlik")[whichElement].find_element_by_xpath('..').get_attribute("innerText")
    return text

# List Of Births
listOfBirths = []

# Loops through dates
while is_search_finished == False:
    driver.get(linkize(search_day, search_month, search_year))
    nextDay()
    is_search_finished = checkIfFinished()
    birth = {
        "day": search_day,
        "month": search_month,
        "year": search_year,
        "exact": {
            "loving": findAspectCount(getAspectText("Loving", True)),
            "key": findAspectCount(getAspectText("Key", True)),
            "passion": findAspectCount(getAspectText("Passion", True)),
            "emotional_pain": findAspectCount(getAspectText("Emotional Pain", True)),
            "easy": findAspectCount(getAspectText("Easy", True)),
            "conflict": findAspectCount(getAspectText("Conflict", True)),
            "combination": findAspectCount(getAspectText("Combination", True)),
        },
        "not_exact": {
            "loving": findAspectCount(getAspectText("Loving", False)),
            "key": findAspectCount(getAspectText("Key", False)),
            "passion": findAspectCount(getAspectText("Passion", False)),
            "emotional_pain": findAspectCount(getAspectText("Emotional Pain", False)),
            "easy": findAspectCount(getAspectText("Easy", False)),
            "conflict": findAspectCount(getAspectText("Conflict", False)),
            "combination": findAspectCount(getAspectText("Combination", False)),
        }
    }
    listOfBirths.append(birth)

print(listOfBirths)


