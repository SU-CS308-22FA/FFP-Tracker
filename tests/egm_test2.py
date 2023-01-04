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
        Test that the TFF admins can penalize teams for not submitting their FFP files

        ASSUMPTIONS:

        -There must be at least one team that has not submitted their FFP file on time
        -The user must send penalty to the team at the top (Galatasaray in this case)
        -The team at the top of the list at penalty page, must submit at least one file before
        -The team at the top of the list at penalty page, must have current budget over 100TL

        1. The user is logged in
        2. The user is on the penalty page
        3. The user refreshed penalty page
        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)


        # Login
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
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
        elem = driver.find_element(By.XPATH, '/html/body/div[1]/main/div[1]/div[4]/div/button/div')
        elem.click()
        time.sleep(2)
        # refresh page
        driver.refresh()
        time.sleep(3)


        #Find the current budget of the team that has not submitted their FFP file on time and at the top of the list
        infoLine = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/ul/div/li[1]/div/div/p')
        #time.sleep(5)
        #Set current budget to substring of the infoLine after 49th character
        currentBudget = infoLine.text[49:]
        # Convert current budget to float
        currentBudgetFloat = float(currentBudget)


        # Find the input field for the team that has not submitted their FFP file on time and at the top of the list
        penalty_input = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/ul/div/li[1]/div/form/div/div/div[1]/input')
        penalty_input.send_keys("100")


        # Find the submit button for the team that has not submitted their FFP file on time and at the top of the list
        submit_button = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/ul/div/li[1]/div/form/div/div/div[2]/button')
        submit_button.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        time.sleep(3)

        # Find the new current budget of the team that has not submitted their FFP file on time and at the top of the list
        infoLine = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/ul/div/li[1]/div/div/p')
        #Set current budget to substring of the infoLine after 49th character
        newCurrentBudget = infoLine.text[49:]
        # Convert current budget to float
        newCurrentBudgetFloat = float(newCurrentBudget)

        #check that the new current budget is 100TL less than the old current budget
        self.assertEqual(newCurrentBudgetFloat, currentBudgetFloat - 100)
        

    def tearDown(self) -> None:
        self.driver.close()

if __name__ == "__main__":
    unittest.main() 

        

        