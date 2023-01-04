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
        Test that the support team page by entering a budget for a team and submitting it

        ASSUMPTIONS:

        -User should not be supporting any teams at the start of the test
        -User should not be rejected by the first team in the table beforehand


        1. The user is logged in
        2. The user is on the support team page
        3. The user has entered a budget for the first team in the table
        4. The user has clicked the submit button
        5. The user has clicked the ok button in the alert
        6. The user see the team page button which indicates 
           that the budget was submitted successfully and request is sent to the team admin

        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)

        # Login
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div/input')
        elem.send_keys("giroys@hotmail.com")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[2]/div/input')
        elem.send_keys("123123")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        elem.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div[1]/div[2]/div/button/div')
        elem.click()
        time.sleep(2)

        # Find the table rows c ontaining the teams
        rows = driver.find_element(By.XPATH,'/html/body/div/main/div')

        # Find the budget input field for the first team
        budget_input = driver.find_element(By.XPATH,'/html/body/div/main/div/div/table/tbody/tr[1]/td[4]/div/div/input')

        # Enter a budget in the input field
        budget_input.send_keys("10000")

        # Find the submit button for the first team
        submit_button = driver.find_element(By.XPATH,'/html/body/div/main/div/div/table/tbody/tr[1]/td[5]/button')

        # Click the submit button
        submit_button.click()

        # Wait for the page to refresh
        time.sleep(3)

        #Click ok in alert
        try:
            alert = driver.switch_to.alert
            alert.accept()
        except NoAlertPresentException:
            print("No alert was present")

        time.sleep(3)

        #Find team page button which appears after submitting budget successfully
        team_page_button = driver.find_element(By.XPATH, '/html/body/div/div[3]/div/div[2]/div/button[1]')
        time.sleep(2)

        self.assertTrue(team_page_button, "Submitting budget was not successful!")


    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
