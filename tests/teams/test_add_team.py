import time
import unittest
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC

class FFPTesting(unittest.TestCase):

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        self.driver = webdriver.Chrome(options=options)

    def test_add_team(self):
        """
        Test that the new team page is accessible,
        and that a new team can be created,
        and that the new team is added to the database and displayed on the teams page
        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div/input')
        elem.send_keys("tffadmin@ffptracker.com")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[2]/div/input')
        elem.send_keys("tffadmin")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        elem.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div/div/nav/div/a[3]')
        elem.click()
        self.assertIn("newteam", driver.current_url)
        time.sleep(1)
        budget = random.randint(100, 1000)
        name = "Test Team "
        for i in range(0, 10):
            name += chr(random.randint(65, 90))
        element = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div[1]/div/div/input')
        element.send_keys(name)
        element = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div[2]/div/div/input')
        element.send_keys(budget)
        element = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        element.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        time.sleep(1)
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        element = driver.find_element(By.XPATH, '/html/body/div/div/nav/div/a[5]')
        element.click()
        self.assertIn("teams", driver.current_url)
        time.sleep(1)
        div_element = driver.find_element(By.CSS_SELECTOR, "#root > div.MuiBox-root.css-7m4n47")
        elements_inside_div = div_element.find_elements(By.XPATH, './/p')
        team_added = False
        for element in elements_inside_div:
            if element.text.find(name) != -1:
                team_added = True
        self.assertTrue(team_added)
            
    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()