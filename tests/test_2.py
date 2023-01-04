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

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        self.driver = webdriver.Chrome(options=options)

    def test_status(self):
        """
        Test that the review suppprt request page by accapting a support request

        ASSUMPTIONS:

        -Request table should not be empty at the start of the test
        -Corresponding team admin should be logged in 
        -For the below example, team admin of Galatasaray should be logged in
        


        1. The user is logged in
        2. The user is on the review support request page
        3. The user has clicked the accept button for the first request in the table
        4. The user has clicked the ok button in the alert
        5. The user see the request page which indicates that the request was accepted successfully

        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)

        # Login
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div/input')
        elem.send_keys("gs@ffptracker.com")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[2]/div/input')
        elem.send_keys("galatasaray")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        elem.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div[1]/div[6]/div/button')
        elem.click()
        time.sleep(2)

        # Find the table rows containing the requests
        rows = driver.find_element(By.XPATH,'/html/body/div/main/div/div[1]')

        # Find the accept button for the first team
        accept_button = driver.find_element(By.XPATH,'/html/body/div/main/div/div[1]/div/table/tbody/tr/td[3]/button[1]')

        # Click the accept button
        accept_button.click()

        # Wait for the page to refresh
        time.sleep(3)

        #Click ok in alert
        try:
            alert = driver.switch_to.alert
            alert.accept()
        except NoAlertPresentException:
            print("No alert was present")

        time.sleep(3)

        #Check the accepting is done successfully
        title = driver.find_element(By.XPATH, '/html/body/div/main/div/div[1]/h1')
        time.sleep(2)

        self.assertTrue(title, "Accepting the request was not successful!")

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
