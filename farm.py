#!/usr/bin/env python3

import os
import platform
import json
import selenium
import signal
import random
import pyautogui
from secrets                                            import token_hex
from bson                                               import json_util
# selenium
import selenium.webdriver.support.expected_conditions   as EC
from selenium.webdriver.common.by                       import By
from selenium                                           import webdriver
from selenium.webdriver.support.ui                      import WebDriverWait
from selenium.webdriver.common.keys                     import Keys
from selenium.webdriver.common.action_chains            import ActionChains
from selenium.common.exceptions                         import (
    TimeoutException, WebDriverException,
    StaleElementReferenceException, NoSuchElementException
)
# time
import time
import pytz
from datetime                                           import date, datetime, timedelta
from dateutil.parser                                    import parse
from dateutil.relativedelta                             import relativedelta

TIMEZONE = 'Europe/Paris'
tz = pytz.timezone(TIMEZONE)

class Leekwar():
    def receiveSignal(self, signalNumber, frame):
        if signalNumber == 2:
            print('Received SIGINT maybe ctrl+c')
        self.quit()
        return

    def init(self):
        self.data_json = {}
        file_json = open('leekwar.json', "r+")
        data_file = file_json.read()
        if data_file and len(data_file) > 0:
            self.data_json = json.loads(data_file, object_hook=json_util.object_hook)
        signal.signal(signal.SIGINT, self.receiveSignal)
        self.driver = webdriver.Firefox()

    def quit(self):
        self.driver.quit()

    def leekwar(self):
        self.driver.get('https://leekwars.com/login')
        time.sleep(3)
        login_field = self.driver.find_element_by_name('login')
        login_field.clear()
        login_field.send_keys(self.data_json['login'])
        pass_field = self.driver.find_element_by_name('password')
        pass_field.clear()
        pass_field.send_keys(self.data_json['password'])
        pass_field.send_keys(Keys.RETURN)
        time.sleep(3)
        self.driver.get('https://leekwars.com/garden')
        poireau = self.driver.find_element_by_class_name('name')[0]
        print(poireau)
        # poireau.click()

run = Leekwar()
run.init()
run.leekwar()
run.quit()