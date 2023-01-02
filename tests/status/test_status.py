import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class FFPTesting(unittest.TestCase):

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        self.driver = webdriver.Chrome(options=options)

    def test_status(self):
        """
        Test that the status page is accessible
        """
        driver = self.driver
        driver.get("https://ffp-tracker.herokuapp.com/")
        self.assertIn("FFP Tracker", driver.title)
        elem = driver.find_element(By.XPATH, '/html/body/div/div[1]/nav/div/div[3]/button[3]')
        elem.click()
        self.assertIn("login", driver.current_url)
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[1]/div/input')
        elem.send_keys("saul.goodman@ffptracker.com")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/div[2]/div/input')
        elem.send_keys("saulgoodman")
        elem = driver.find_element(By.XPATH, '/html/body/div/main/div/form/button')
        elem.click()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        self.assertIn("my/profile", driver.current_url)
        time.sleep(1)
        elem = driver.find_element(By.XPATH, '/html/body/div/div/nav/div/button[1]')
        elem.click()
        self.assertIn("status", driver.current_url)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()