import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC


class FFPTesting(unittest.TestCase):

    def setUp(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        self.driver = webdriver.Chrome(options=options)

    def test_status(self):
        """
        Test that the Team Admins can add new players to the team

        ASSUMPTIONS:

        -User should not enter a player with a number that already exists in the team
        -User should not enter a goalkeepers if there are already 3 goalkeepers in the team
        -User should not enter a natioanality other than Turkiye, if there are already 14 players with that
        -User should enter a shirt number between 1 and 99 
        -There are no players in the team at the start of the test


        1. The user is logged in
        2. The user is on the players page
        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)


        # Login
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div/input')
        elem.send_keys("retsim75@gmail.com")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[2]/div/input')
        elem.send_keys("1234")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        elem.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div[1]/main/div[1]/div[2]/div/button')
        elem.click()
        time.sleep(2)
        elem = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/div[2]/form/p/a')
        elem.click()
        time.sleep(2)

        # Find name input field and type in a name
        name_input = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/div[2]/form/div[1]/div/input')
        name_input.send_keys("Test Player")

        # Find wage input field and type in a number
        wage_input = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/div[2]/form/div[4]/div/input')
        wage_input.send_keys("100000")

        # Find birthdate input field and type in a date
        birthDate_input = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/div[2]/form/div[6]/div/div/input')
        birthDate_input.send_keys("01/01/1990")

        # click add player button
        add_player_button = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[2]/div/div[2]/form/button')
        add_player_button.click()
        time.sleep(1)

        # Check that the player is added to the team

        
        # Find the player name and number, position, nationality, wage sentence in the table
        player_name = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[1]/div/div[2]/ul/li/div[2]/span')
        player_info = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[1]/div/div[2]/ul/li/div[2]/p/span')
        player_wage_percent = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[1]/div/div[2]/ul/li/div[2]/p/p')


        # Check that the player name is correct
        self.assertEqual(player_name.text, "Test Player")

        # Check that the player info is correct
        self.assertEqual(player_info.text, "1 - GK - Afghanistan - 100000 TL/yr - 1990-01-01")

        # Check that the player wage percent is correct
        self.assertEqual(player_wage_percent.text, "100.00% of total wage")  

    def tearDown(self) -> None:
        self.driver.close()

if __name__ == "__main__":
    unittest.main() 

        

        