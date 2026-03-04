import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Globe, CheckCircle, AlertCircle, Home, Volume2 } from 'lucide-react';

export default function FrenchLearningApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userLevel, setUserLevel] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dictionaryResults, setDictionaryResults] = useState([]);

  // Pronunciation helper function
  const speakText = (text, lang = 'fr-FR') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower
      utterance.pitch = 1;
      speechSynthesis.cancel(); // Cancel any previous speech
      speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in your browser');
    }
  };

  // Expanded French Learning Data with detailed pronunciation
  const frenchDictionary = [
    // Greetings & Polite
    { french: 'Bonjour', english: 'Hello', pronunciation: 'bon-ZHOOR', guide: '(day-time greeting)' },
    { french: 'Bonsoir', english: 'Good evening', pronunciation: 'bon-SWAHR', guide: '(after 6 PM)' },
    { french: 'Bonne nuit', english: 'Good night', pronunciation: 'bon NWEE', guide: '(before sleep)' },
    { french: 'Au revoir', english: 'Goodbye', pronunciation: 'oh ruh-VWAHR', guide: '(standard farewell)' },
    { french: 'À bientôt', english: 'See you soon', pronunciation: 'ah bee-en-TOH', guide: '(friendly goodbye)' },
    { french: 'À plus tard', english: 'See you later', pronunciation: 'ah plu TAR', guide: '(casual goodbye)' },
    { french: 'S\'il vous plaît', english: 'Please (formal)', pronunciation: 'see voo PLEH', guide: '(polite request)' },
    { french: 'S\'il te plaît', english: 'Please (informal)', pronunciation: 'see tuh PLEH', guide: '(casual request)' },
    { french: 'Merci', english: 'Thank you', pronunciation: 'mehr-SEE', guide: '(basic thanks)' },
    { french: 'Merci beaucoup', english: 'Thank you very much', pronunciation: 'mehr-SEE boh-KOO', guide: '(strong thanks)' },
    { french: 'De rien', english: 'You\'re welcome', pronunciation: 'duh ree-YEN', guide: '(response to thanks)' },
    { french: 'Avec plaisir', english: 'With pleasure', pronunciation: 'ah-VEK pleh-ZIR', guide: '(friendly response)' },
    { french: 'Oui', english: 'Yes', pronunciation: 'WEE', guide: '(affirmation)' },
    { french: 'Non', english: 'No', pronunciation: 'NOHN', guide: '(negation)' },
    { french: 'Je m\'appelle', english: 'My name is', pronunciation: 'zhuh mah-PEL', guide: '(self-introduction)' },
    { french: 'Enchanté', english: 'Nice to meet you (m)', pronunciation: 'on-shan-TAY', guide: '(meeting someone)' },
    { french: 'Enchantée', english: 'Nice to meet you (f)', pronunciation: 'on-shan-TAY', guide: '(feminine form)' },
    { french: 'Ça va?', english: 'How are you?', pronunciation: 'sah VAH', guide: '(casual greeting)' },
    { french: 'Comment allez-vous?', english: 'How are you? (formal)', pronunciation: 'koh-MON tah-lay-VOO', guide: '(formal greeting)' },
    { french: 'Très bien', english: 'Very well', pronunciation: 'TREH bee-YEN', guide: '(positive response)' },
    { french: 'Bien, merci', english: 'Good, thank you', pronunciation: 'bee-YEN, mehr-SEE', guide: '(polite response)' },
    { french: 'Pas mal', english: 'Not bad', pronunciation: 'pah MAHL', guide: '(ok response)' },
    { french: 'Mal', english: 'Bad', pronunciation: 'MAHL', guide: '(negative response)' },
    { french: 'Je vais bien', english: 'I\'m doing well', pronunciation: 'zhuh VEH bee-YEN', guide: '(positive response)' },
    
    // Numbers
    { french: 'Zéro', english: 'Zero', pronunciation: 'ZAY-roh', guide: '(0)' },
    { french: 'Un', english: 'One', pronunciation: 'UHN', guide: '(1)' },
    { french: 'Deux', english: 'Two', pronunciation: 'DUH', guide: '(2)' },
    { french: 'Trois', english: 'Three', pronunciation: 'TWAH', guide: '(3)' },
    { french: 'Quatre', english: 'Four', pronunciation: 'KAH-truh', guide: '(4)' },
    { french: 'Cinq', english: 'Five', pronunciation: 'SANK', guide: '(5)' },
    { french: 'Six', english: 'Six', pronunciation: 'SEES', guide: '(6)' },
    { french: 'Sept', english: 'Seven', pronunciation: 'SET', guide: '(7)' },
    { french: 'Huit', english: 'Eight', pronunciation: 'WEET', guide: '(8)' },
    { french: 'Neuf', english: 'Nine', pronunciation: 'NUH', guide: '(9)' },
    { french: 'Dix', english: 'Ten', pronunciation: 'DEES', guide: '(10)' },
    { french: 'Onze', english: 'Eleven', pronunciation: 'ONZE', guide: '(11)' },
    { french: 'Douze', english: 'Twelve', pronunciation: 'DOOZ', guide: '(12)' },
    { french: 'Treize', english: 'Thirteen', pronunciation: 'TREZ', guide: '(13)' },
    { french: 'Quatorze', english: 'Fourteen', pronunciation: 'kah-TORZ', guide: '(14)' },
    { french: 'Quinze', english: 'Fifteen', pronunciation: 'KANZ', guide: '(15)' },
    { french: 'Seize', english: 'Sixteen', pronunciation: 'SEZ', guide: '(16)' },
    { french: 'Dix-sept', english: 'Seventeen', pronunciation: 'dees-SET', guide: '(17)' },
    { french: 'Dix-huit', english: 'Eighteen', pronunciation: 'dees-WEET', guide: '(18)' },
    { french: 'Dix-neuf', english: 'Nineteen', pronunciation: 'dees-NUH', guide: '(19)' },
    { french: 'Vingt', english: 'Twenty', pronunciation: 'VAHN', guide: '(20)' },
    
    // Colors
    { french: 'Rouge', english: 'Red', pronunciation: 'ROOZH', guide: '(primary color)' },
    { french: 'Bleu', english: 'Blue', pronunciation: 'BLUH', guide: '(primary color)' },
    { french: 'Jaune', english: 'Yellow', pronunciation: 'ZHOHN', guide: '(primary color)' },
    { french: 'Vert', english: 'Green', pronunciation: 'VEHR', guide: '(common color)' },
    { french: 'Noir', english: 'Black', pronunciation: 'NWAHR', guide: '(neutral color)' },
    { french: 'Blanc', english: 'White', pronunciation: 'BLAHN', guide: '(neutral color)' },
    { french: 'Rose', english: 'Pink', pronunciation: 'ROHZ', guide: '(light color)' },
    { french: 'Orange', english: 'Orange', pronunciation: 'oh-RANZH', guide: '(fruit color)' },
    { french: 'Violet', english: 'Purple', pronunciation: 'vee-oh-LAY', guide: '(mixed color)' },
    { french: 'Gris', english: 'Gray', pronunciation: 'GREE', guide: '(neutral shade)' },
    { french: 'Marron', english: 'Brown', pronunciation: 'mah-ROHN', guide: '(earth tone)' },
    
    // Common Phrases
    { french: 'Excusez-moi', english: 'Excuse me (formal)', pronunciation: 'ehk-skew-zay-MWAH', guide: '(getting attention)' },
    { french: 'Excuse-moi', english: 'Excuse me (informal)', pronunciation: 'ehk-SKEWZ-mwah', guide: '(casual)' },
    { french: 'Je ne comprends pas', english: 'I don\'t understand', pronunciation: 'zhuh nuh kohm-PRAHN pah', guide: '(asking for help)' },
    { french: 'Parlez plus lentement', english: 'Speak more slowly', pronunciation: 'par-LAY plu lent-MAHN', guide: '(requesting clarity)' },
    { french: 'Où est la toilette?', english: 'Where is the bathroom?', pronunciation: 'OO eh lah twah-LET', guide: '(essential phrase)' },
    { french: 'Où est la gare?', english: 'Where is the train station?', pronunciation: 'OO eh lah GAR', guide: '(travel phrase)' },
    { french: 'Combien ça coûte?', english: 'How much does it cost?', pronunciation: 'kohm-bee-YEN sah KOOT', guide: '(shopping)' },
    { french: 'C\'est combien?', english: 'How much is it?', pronunciation: 'say kohm-bee-YEN', guide: '(price inquiry)' },
    { french: 'Pouvez-vous m\'aider?', english: 'Can you help me?', pronunciation: 'POO-vay-voo may-DAY', guide: '(asking for help)' },
    { french: 'Je m\'appelle Jean', english: 'My name is Jean', pronunciation: 'zhuh mah-PEL ZHOHN', guide: '(introduction)' },
    
    // Food & Drink
    { french: 'Eau', english: 'Water', pronunciation: 'OH', guide: '(essential drink)' },
    { french: 'Pain', english: 'Bread', pronunciation: 'PAN', guide: '(staple food)' },
    { french: 'Fromage', english: 'Cheese', pronunciation: 'froh-MAHZH', guide: '(dairy)' },
    { french: 'Vin', english: 'Wine', pronunciation: 'VAN', guide: '(alcoholic drink)' },
    { french: 'Bière', english: 'Beer', pronunciation: 'bee-AIR', guide: '(alcoholic drink)' },
    { french: 'Café', english: 'Coffee', pronunciation: 'kah-FAY', guide: '(hot drink)' },
    { french: 'Thé', english: 'Tea', pronunciation: 'TAY', guide: '(hot drink)' },
    { french: 'Lait', english: 'Milk', pronunciation: 'LAY', guide: '(dairy)' },
    { french: 'Jus', english: 'Juice', pronunciation: 'ZHOO', guide: '(drink)' },
    { french: 'Viande', english: 'Meat', pronunciation: 'vee-AHND', guide: '(protein)' },
    { french: 'Poisson', english: 'Fish', pronunciation: 'pwah-SOHN', guide: '(protein)' },
    { french: 'Poulet', english: 'Chicken', pronunciation: 'poo-LAY', guide: '(poultry)' },
    { french: 'Fruits', english: 'Fruits', pronunciation: 'FRWEE', guide: '(produce)' },
    { french: 'Légumes', english: 'Vegetables', pronunciation: 'lay-GOOM', guide: '(produce)' },
    { french: 'Pomme', english: 'Apple', pronunciation: 'POHM', guide: '(fruit)' },
    { french: 'Banane', english: 'Banana', pronunciation: 'bah-NAHN', guide: '(fruit)' },
    { french: 'Orange', english: 'Orange (fruit)', pronunciation: 'oh-RANZH', guide: '(fruit)' },
    { french: 'Fraise', english: 'Strawberry', pronunciation: 'FREZ', guide: '(berry)' },
    
    // Family
    { french: 'Père', english: 'Father', pronunciation: 'PEHR', guide: '(male parent)' },
    { french: 'Mère', english: 'Mother', pronunciation: 'MEHR', guide: '(female parent)' },
    { french: 'Frère', english: 'Brother', pronunciation: 'FREHR', guide: '(male sibling)' },
    { french: 'Sœur', english: 'Sister', pronunciation: 'SUR', guide: '(female sibling)' },
    { french: 'Fils', english: 'Son', pronunciation: 'FEES', guide: '(male child)' },
    { french: 'Fille', english: 'Daughter', pronunciation: 'FEE', guide: '(female child)' },
    { french: 'Grand-mère', english: 'Grandmother', pronunciation: 'grahn-MEHR', guide: '(paternal/maternal)' },
    { french: 'Grand-père', english: 'Grandfather', pronunciation: 'grahn-PEHR', guide: '(paternal/maternal)' },
    { french: 'Tante', english: 'Aunt', pronunciation: 'TAHNT', guide: '(parent\'s sister)' },
    { french: 'Oncle', english: 'Uncle', pronunciation: 'ONKL', guide: '(parent\'s brother)' },
    { french: 'Cousin', english: 'Cousin (m)', pronunciation: 'koo-ZAN', guide: '(relative)' },
    { french: 'Cousine', english: 'Cousin (f)', pronunciation: 'koo-ZEEN', guide: '(female relative)' },
    
    // Days & Time
    { french: 'Lundi', english: 'Monday', pronunciation: 'lun-DEE', guide: '(day 1)' },
    { french: 'Mardi', english: 'Tuesday', pronunciation: 'mar-DEE', guide: '(day 2)' },
    { french: 'Mercredi', english: 'Wednesday', pronunciation: 'mehr-kruh-DEE', guide: '(day 3)' },
    { french: 'Jeudi', english: 'Thursday', pronunciation: 'zhuh-DEE', guide: '(day 4)' },
    { french: 'Vendredi', english: 'Friday', pronunciation: 'vahn-druh-DEE', guide: '(day 5)' },
    { french: 'Samedi', english: 'Saturday', pronunciation: 'sahm-DEE', guide: '(day 6)' },
    { french: 'Dimanche', english: 'Sunday', pronunciation: 'dee-MANSH', guide: '(day 7)' },
    { french: 'Aujourd\'hui', english: 'Today', pronunciation: 'oh-zhoor-DWEE', guide: '(current day)' },
    { french: 'Hier', english: 'Yesterday', pronunciation: 'ee-AIR', guide: '(past day)' },
    { french: 'Demain', english: 'Tomorrow', pronunciation: 'duh-MAN', guide: '(future day)' },
    { french: 'Matin', english: 'Morning', pronunciation: 'mah-TAN', guide: '(early hours)' },
    { french: 'Après-midi', english: 'Afternoon', pronunciation: 'ah-pray-mee-DEE', guide: '(midday)' },
    { french: 'Soir', english: 'Evening', pronunciation: 'SWAHR', guide: '(late afternoon)' },
    { french: 'Nuit', english: 'Night', pronunciation: 'NWEE', guide: '(dark hours)' },
  ];

  const lessons = {
    basic: [
      {
        id: 1,
        title: 'Greetings & Introductions',
        content: [
          { phrase: 'Bonjour', pronunciation: 'bon-ZHOOR', translation: 'Hello', context: 'Used during the day', phonetic: '(day-time greeting)' },
          { phrase: 'Bonsoir', pronunciation: 'bon-SWAHR', translation: 'Good evening', context: 'Used after 6 PM', phonetic: '(after 6 PM)' },
          { phrase: 'Bonne nuit', pronunciation: 'bon NWEE', translation: 'Good night', context: 'Before sleep', phonetic: '(before sleep)' },
          { phrase: 'Au revoir', pronunciation: 'oh ruh-VWAHR', translation: 'Goodbye', context: 'Standard farewell', phonetic: '(standard farewell)' },
          { phrase: 'À bientôt', pronunciation: 'ah bee-en-TOH', translation: 'See you soon', context: 'Friendly goodbye', phonetic: '(friendly goodbye)' },
        ]
      },
      {
        id: 2,
        title: 'Numbers 0-10',
        content: [
          { phrase: 'Zéro', pronunciation: 'ZAY-roh', translation: 'Zero', context: '0', phonetic: '(num 0)' },
          { phrase: 'Un', pronunciation: 'UHN', translation: 'One', context: '1', phonetic: '(num 1)' },
          { phrase: 'Deux', pronunciation: 'DUH', translation: 'Two', context: '2', phonetic: '(num 2)' },
          { phrase: 'Trois', pronunciation: 'TWAH', translation: 'Three', context: '3', phonetic: '(num 3)' },
          { phrase: 'Quatre', pronunciation: 'KAH-truh', translation: 'Four', context: '4', phonetic: '(num 4)' },
          { phrase: 'Cinq', pronunciation: 'SANK', translation: 'Five', context: '5', phonetic: '(num 5)' },
          { phrase: 'Six', pronunciation: 'SEES', translation: 'Six', context: '6', phonetic: '(num 6)' },
          { phrase: 'Sept', pronunciation: 'SET', translation: 'Seven', context: '7', phonetic: '(num 7)' },
          { phrase: 'Huit', pronunciation: 'WEET', translation: 'Eight', context: '8', phonetic: '(num 8)' },
          { phrase: 'Dix', pronunciation: 'DEES', translation: 'Ten', context: '10', phonetic: '(num 10)' },
        ]
      },
      {
        id: 3,
        title: 'Numbers 11-20',
        content: [
          { phrase: 'Onze', pronunciation: 'ONZE', translation: 'Eleven', context: '11', phonetic: '(num 11)' },
          { phrase: 'Douze', pronunciation: 'DOOZ', translation: 'Twelve', context: '12', phonetic: '(num 12)' },
          { phrase: 'Treize', pronunciation: 'TREZ', translation: 'Thirteen', context: '13', phonetic: '(num 13)' },
          { phrase: 'Quatorze', pronunciation: 'kah-TORZ', translation: 'Fourteen', context: '14', phonetic: '(num 14)' },
          { phrase: 'Quinze', pronunciation: 'KANZ', translation: 'Fifteen', context: '15', phonetic: '(num 15)' },
          { phrase: 'Seize', pronunciation: 'SEZ', translation: 'Sixteen', context: '16', phonetic: '(num 16)' },
          { phrase: 'Dix-sept', pronunciation: 'dees-SET', translation: 'Seventeen', context: '17', phonetic: '(num 17)' },
          { phrase: 'Dix-huit', pronunciation: 'dees-WEET', translation: 'Eighteen', context: '18', phonetic: '(num 18)' },
          { phrase: 'Dix-neuf', pronunciation: 'dees-NUH', translation: 'Nineteen', context: '19', phonetic: '(num 19)' },
          { phrase: 'Vingt', pronunciation: 'VAHN', translation: 'Twenty', context: '20', phonetic: '(num 20)' },
        ]
      },
      {
        id: 4,
        title: 'Basic Greetings & Responses',
        content: [
          { phrase: 'Ça va?', pronunciation: 'sah VAH', translation: 'How are you?', context: 'Casual greeting', phonetic: '(informal)' },
          { phrase: 'Comment allez-vous?', pronunciation: 'koh-MON tah-lay-VOO', translation: 'How are you? (formal)', context: 'Polite greeting', phonetic: '(formal)' },
          { phrase: 'Très bien, merci', pronunciation: 'TREH bee-YEN, mehr-SEE', translation: 'Very well, thank you', context: 'Positive response', phonetic: '(enthusiastic)' },
          { phrase: 'Je vais bien', pronunciation: 'zhuh VEH bee-YEN', translation: 'I\'m doing well', context: 'Simple response', phonetic: '(straightforward)' },
          { phrase: 'Et vous?', pronunciation: 'ay VOO', translation: 'And you?', context: 'Returning the question', phonetic: '(polite reply)' },
        ]
      },
      {
        id: 5,
        title: 'Polite Expressions',
        content: [
          { phrase: 'S\'il vous plaît', pronunciation: 'see voo PLEH', translation: 'Please (formal)', context: 'Formal request', phonetic: '(respectful)' },
          { phrase: 'S\'il te plaît', pronunciation: 'see tuh PLEH', translation: 'Please (informal)', context: 'Casual request', phonetic: '(friendly)' },
          { phrase: 'Merci beaucoup', pronunciation: 'mehr-SEE boh-KOO', translation: 'Thank you very much', context: 'Strong thanks', phonetic: '(grateful)' },
          { phrase: 'De rien', pronunciation: 'duh ree-YEN', translation: 'You\'re welcome', context: 'Response to thanks', phonetic: '(polite response)' },
        ]
      },
      {
        id: 6,
        title: 'Basic Colors',
        content: [
          { phrase: 'Rouge', pronunciation: 'ROOZH', translation: 'Red', context: 'Primary color', phonetic: '(primary)' },
          { phrase: 'Bleu', pronunciation: 'BLUH', translation: 'Blue', context: 'Primary color', phonetic: '(primary)' },
          { phrase: 'Jaune', pronunciation: 'ZHOHN', translation: 'Yellow', context: 'Primary color', phonetic: '(primary)' },
          { phrase: 'Vert', pronunciation: 'VEHR', translation: 'Green', context: 'Common color', phonetic: '(natural)' },
          { phrase: 'Noir et Blanc', pronunciation: 'NWAHR ay BLAHN', translation: 'Black and White', context: 'Neutral colors', phonetic: '(opposites)' },
        ]
      },
      {
        id: 7,
        title: 'More Colors',
        content: [
          { phrase: 'Rose', pronunciation: 'ROHZ', translation: 'Pink', context: 'Light color', phonetic: '(light)' },
          { phrase: 'Orange', pronunciation: 'oh-RANZH', translation: 'Orange', context: 'Mixed color', phonetic: '(fruit color)' },
          { phrase: 'Violet', pronunciation: 'vee-oh-LAY', translation: 'Purple', context: 'Mixed color', phonetic: '(regal)' },
          { phrase: 'Gris', pronunciation: 'GREE', translation: 'Gray', context: 'Neutral shade', phonetic: '(neutral)' },
          { phrase: 'Marron', pronunciation: 'mah-ROHN', translation: 'Brown', context: 'Earth tone', phonetic: '(natural)' },
        ]
      },
      {
        id: 8,
        title: 'Introduction & Names',
        content: [
          { phrase: 'Je m\'appelle...', pronunciation: 'zhuh mah-PEL', translation: 'My name is...', context: 'Introducing yourself', phonetic: '(self-intro)' },
          { phrase: 'Enchanté', pronunciation: 'on-shan-TAY', translation: 'Nice to meet you (m)', context: 'Meeting someone', phonetic: '(masculine)' },
          { phrase: 'Enchantée', pronunciation: 'on-shan-TAY', translation: 'Nice to meet you (f)', context: 'Meeting someone', phonetic: '(feminine)' },
          { phrase: 'Quel est votre nom?', pronunciation: 'kell ay VOH-truh NOHM', translation: 'What is your name? (formal)', context: 'Asking name', phonetic: '(formal)' },
          { phrase: 'Comment tu t\'appelles?', pronunciation: 'koh-MAHN too tah-PEL', translation: 'What\'s your name? (informal)', context: 'Asking name', phonetic: '(casual)' },
        ]
      },
      {
        id: 9,
        title: 'Basic Phrases for Everyday',
        content: [
          { phrase: 'Oui', pronunciation: 'WEE', translation: 'Yes', context: 'Affirmation', phonetic: '(positive)' },
          { phrase: 'Non', pronunciation: 'NOHN', translation: 'No', context: 'Negation', phonetic: '(negative)' },
          { phrase: 'D\'accord', pronunciation: 'dah-KOR', translation: 'Okay/Agreed', context: 'Agreement', phonetic: '(agreement)' },
          { phrase: 'Je ne sais pas', pronunciation: 'zhuh nuh SAY pah', translation: 'I don\'t know', context: 'Uncertainty', phonetic: '(unsure)' },
          { phrase: 'C\'est vrai', pronunciation: 'say VRAY', translation: 'That\'s true', context: 'Confirmation', phonetic: '(agreement)' },
        ]
      },
      {
        id: 10,
        title: 'Days of the Week',
        content: [
          { phrase: 'Lundi', pronunciation: 'lun-DEE', translation: 'Monday', context: 'First day', phonetic: '(day 1)' },
          { phrase: 'Mardi', pronunciation: 'mar-DEE', translation: 'Tuesday', context: 'Second day', phonetic: '(day 2)' },
          { phrase: 'Mercredi', pronunciation: 'mehr-kruh-DEE', translation: 'Wednesday', context: 'Third day', phonetic: '(day 3)' },
          { phrase: 'Jeudi', pronunciation: 'zhuh-DEE', translation: 'Thursday', context: 'Fourth day', phonetic: '(day 4)' },
          { phrase: 'Vendredi', pronunciation: 'vahn-druh-DEE', translation: 'Friday', context: 'Fifth day', phonetic: '(day 5)' },
        ]
      },
      {
        id: 11,
        title: 'Common Objects',
        content: [
          { phrase: 'Un livre', pronunciation: 'uhn LEE-vruh', translation: 'A book', context: 'School item', phonetic: '(reading)' },
          { phrase: 'Un stylo', pronunciation: 'uhn stee-LOH', translation: 'A pen', context: 'Writing tool', phonetic: '(writing)' },
          { phrase: 'Une table', pronunciation: 'ewn TAH-bluh', translation: 'A table', context: 'Furniture', phonetic: '(furniture)' },
          { phrase: 'Une chaise', pronunciation: 'ewn SHEZ', translation: 'A chair', context: 'Furniture', phonetic: '(sitting)' },
          { phrase: 'Un téléphone', pronunciation: 'uhn tay-lay-FOHN', translation: 'A phone', context: 'Technology', phonetic: '(communication)' },
        ]
      },
      {
        id: 12,
        title: 'Basic Family Words',
        content: [
          { phrase: 'Père', pronunciation: 'PEHR', translation: 'Father', context: 'Male parent', phonetic: '(dad)' },
          { phrase: 'Mère', pronunciation: 'MEHR', translation: 'Mother', context: 'Female parent', phonetic: '(mom)' },
          { phrase: 'Frère', pronunciation: 'FREHR', translation: 'Brother', context: 'Male sibling', phonetic: '(sibling)' },
          { phrase: 'Sœur', pronunciation: 'SUR', translation: 'Sister', context: 'Female sibling', phonetic: '(sibling)' },
          { phrase: 'Famille', pronunciation: 'fah-MEE', translation: 'Family', context: 'All relatives', phonetic: '(kinship)' },
        ]
      },
      {
        id: 13,
        title: 'Basic Food & Drink',
        content: [
          { phrase: 'Eau', pronunciation: 'OH', translation: 'Water', context: 'Essential drink', phonetic: '(beverage)' },
          { phrase: 'Pain', pronunciation: 'PAN', translation: 'Bread', context: 'Staple food', phonetic: '(carbs)' },
          { phrase: 'Fromage', pronunciation: 'froh-MAHZH', translation: 'Cheese', context: 'Dairy product', phonetic: '(dairy)' },
          { phrase: 'Pomme', pronunciation: 'POHM', translation: 'Apple', context: 'Fruit', phonetic: '(fruit)' },
          { phrase: 'Café', pronunciation: 'kah-FAY', translation: 'Coffee', context: 'Hot drink', phonetic: '(beverage)' },
        ]
      },
      {
        id: 14,
        title: 'Useful Expressions',
        content: [
          { phrase: 'Excusez-moi', pronunciation: 'ehk-skew-zay-MWAH', translation: 'Excuse me (formal)', context: 'Getting attention', phonetic: '(formal)' },
          { phrase: 'Excuse-moi', pronunciation: 'ehk-SKEWZ-mwah', translation: 'Excuse me (informal)', context: 'Getting attention', phonetic: '(casual)' },
          { phrase: 'Je ne comprends pas', pronunciation: 'zhuh nuh kohm-PRAHN pah', translation: 'I don\'t understand', context: 'Asking for clarification', phonetic: '(confusion)' },
          { phrase: 'Parlez plus lentement', pronunciation: 'par-LAY plu lent-MAHN', translation: 'Speak more slowly', context: 'Requesting slower speech', phonetic: '(patience)' },
        ]
      },
      {
        id: 15,
        title: 'Time of Day',
        content: [
          { phrase: 'Matin', pronunciation: 'mah-TAN', translation: 'Morning', context: 'Early hours', phonetic: '(AM)' },
          { phrase: 'Après-midi', pronunciation: 'ah-pray-mee-DEE', translation: 'Afternoon', context: 'Middle of day', phonetic: '(midday)' },
          { phrase: 'Soir', pronunciation: 'SWAHR', translation: 'Evening', context: 'Late afternoon/early night', phonetic: '(PM)' },
          { phrase: 'Nuit', pronunciation: 'NWEE', translation: 'Night', context: 'Dark hours', phonetic: '(night)' },
          { phrase: 'Aujourd\'hui', pronunciation: 'oh-zhoor-DWEE', translation: 'Today', context: 'Current day', phonetic: '(now)' },
        ]
      },
    ],
    intermediate: [
      {
        id: 1,
        title: 'Present Tense: Être (To Be)',
        content: [
          { phrase: 'Je suis', pronunciation: 'zhuh SWEE', translation: 'I am', context: 'First person', phonetic: '(identity)' },
          { phrase: 'Tu es', pronunciation: 'too AY', translation: 'You are (informal)', context: 'Second person singular', phonetic: '(informal)' },
          { phrase: 'Il/Elle est', pronunciation: 'eel/EL ay', translation: 'He/She is', context: 'Third person singular', phonetic: '(he/she)' },
          { phrase: 'Nous sommes', pronunciation: 'noo SUM', translation: 'We are', context: 'First person plural', phonetic: '(we)' },
          { phrase: 'Vous êtes', pronunciation: 'voo ET', translation: 'You are (formal/plural)', context: 'Second person plural', phonetic: '(formal/plural)' },
        ]
      },
      {
        id: 2,
        title: 'Present Tense: Avoir (To Have)',
        content: [
          { phrase: 'J\'ai', pronunciation: 'zhay', translation: 'I have', context: 'First person', phonetic: '(possession)' },
          { phrase: 'Tu as', pronunciation: 'too AH', translation: 'You have (informal)', context: 'Second person', phonetic: '(informal)' },
          { phrase: 'Il/Elle a', pronunciation: 'eel/EL AH', translation: 'He/She has', context: 'Third person', phonetic: '(he/she)' },
          { phrase: 'Nous avons', pronunciation: 'noo zah-VON', translation: 'We have', context: 'First person plural', phonetic: '(we)' },
          { phrase: 'Vous avez', pronunciation: 'voo zah-VAY', translation: 'You have (formal)', context: 'Second person plural', phonetic: '(formal)' },
        ]
      },
      {
        id: 3,
        title: 'Present Tense: Regular -ER Verbs',
        content: [
          { phrase: 'Je parle', pronunciation: 'zhuh PAR-luh', translation: 'I speak', context: 'Regular verb', phonetic: '(parler)' },
          { phrase: 'Tu parles', pronunciation: 'too PAR-luh', translation: 'You speak', context: 'Informal you', phonetic: '(informal)' },
          { phrase: 'Il parle', pronunciation: 'eel PAR-luh', translation: 'He speaks', context: 'Third person', phonetic: '(he)' },
          { phrase: 'Nous parlons', pronunciation: 'noo par-LON', translation: 'We speak', context: 'Plural we', phonetic: '(we)' },
          { phrase: 'Vous parlez', pronunciation: 'voo par-LAY', translation: 'You speak (formal)', context: 'Formal you', phonetic: '(formal)' },
        ]
      },
      {
        id: 4,
        title: 'More Regular Verbs: Travailler, Écouter',
        content: [
          { phrase: 'Je travaille', pronunciation: 'zhuh trah-VAH', translation: 'I work', context: 'Regular verb', phonetic: '(travailler)' },
          { phrase: 'Tu travailles', pronunciation: 'too trah-VAH', translation: 'You work', context: 'Informal', phonetic: '(informal)' },
          { phrase: 'J\'écoute', pronunciation: 'zhay-KOO-tuh', translation: 'I listen', context: 'Regular verb', phonetic: '(écouter)' },
          { phrase: 'Tu écoutes', pronunciation: 'too ay-KOO-tuh', translation: 'You listen', context: 'Informal', phonetic: '(informal)' },
          { phrase: 'Nous écoutons', pronunciation: 'noo zay-koo-TON', translation: 'We listen', context: 'Plural', phonetic: '(we)' },
        ]
      },
      {
        id: 5,
        title: 'Restaurant & Food Ordering',
        content: [
          { phrase: 'Je voudrais...', pronunciation: 'zhuh VOO-druh', translation: 'I would like...', context: 'Polite request', phonetic: '(polite)' },
          { phrase: 'L\'addition, s\'il vous plaît', pronunciation: 'lah-dee-SYON, see voo PLEH', translation: 'The bill, please', context: 'Requesting bill', phonetic: '(payment)' },
          { phrase: 'C\'est délicieux', pronunciation: 'say day-lee-SYUH', translation: 'It\'s delicious', context: 'Complimenting', phonetic: '(tasty)' },
          { phrase: 'Je suis végétarien', pronunciation: 'zhuh SWEE vay-zhay-tah-REE-en', translation: 'I am vegetarian', context: 'Dietary info', phonetic: '(dietary)' },
          { phrase: 'Avez-vous une table libre?', pronunciation: 'ah-vay-VOO ewn TAH-bluh LEE-bruh', translation: 'Do you have a free table?', context: 'Booking table', phonetic: '(seating)' },
        ]
      },
      {
        id: 6,
        title: 'Travel & Transportation',
        content: [
          { phrase: 'Où est la gare?', pronunciation: 'OO ay lah GAR', translation: 'Where is the train station?', context: 'Asking location', phonetic: '(location)' },
          { phrase: 'Où est la gare routière?', pronunciation: 'OO ay lah gar roo-tee-AIR', translation: 'Where is the bus station?', context: 'Bus travel', phonetic: '(buses)' },
          { phrase: 'Un billet pour Paris', pronunciation: 'uhn bee-YAY poor pah-REE', translation: 'A ticket to Paris', context: 'Buying ticket', phonetic: '(tickets)' },
          { phrase: 'Quelle est la prochaine gare?', pronunciation: 'kell ay lah proh-SHEN gar', translation: 'What is the next stop?', context: 'During travel', phonetic: '(stops)' },
          { phrase: 'Je voudrais un aller-retour', pronunciation: 'zhuh VOO-druh uhn ah-lay-ruh-TOUR', translation: 'I would like a round trip', context: 'Booking', phonetic: '(round-trip)' },
        ]
      },
      {
        id: 7,
        title: 'Directions & Locations',
        content: [
          { phrase: 'Allez tout droit', pronunciation: 'ah-LAY too DRWAH', translation: 'Go straight', context: 'Direction', phonetic: '(straight)' },
          { phrase: 'Tournez à gauche', pronunciation: 'tour-NAY ah GOSH', translation: 'Turn left', context: 'Direction', phonetic: '(left)' },
          { phrase: 'Tournez à droite', pronunciation: 'tour-NAY ah DRWAH-tuh', translation: 'Turn right', context: 'Direction', phonetic: '(right)' },
          { phrase: 'Près de', pronunciation: 'PRAY duh', translation: 'Near', context: 'Location', phonetic: '(near)' },
          { phrase: 'Loin de', pronunciation: 'LWAN duh', translation: 'Far from', context: 'Location', phonetic: '(far)' },
        ]
      },
      {
        id: 8,
        title: 'Shopping & Money',
        content: [
          { phrase: 'Combien ça coûte?', pronunciation: 'kohm-bee-YEN sah KOOT', translation: 'How much does it cost?', context: 'Price inquiry', phonetic: '(price)' },
          { phrase: 'C\'est trop cher', pronunciation: 'say TROH sher', translation: 'It\'s too expensive', context: 'Complaint', phonetic: '(expensive)' },
          { phrase: 'C\'est pas cher', pronunciation: 'say PAH sher', translation: 'It\'s cheap', context: 'Positive comment', phonetic: '(cheap)' },
          { phrase: 'Je voudrais payer', pronunciation: 'zhuh VOO-druh pay-YAY', translation: 'I would like to pay', context: 'Checkout', phonetic: '(payment)' },
          { phrase: 'Acceptez-vous les cartes de crédit?', pronunciation: 'ahk-sep-tay-VOO lay kart duh KRAY-dee', translation: 'Do you accept credit cards?', context: 'Payment method', phonetic: '(cards)' },
        ]
      },
      {
        id: 9,
        title: 'Past Tense: Passé Composé with Avoir',
        content: [
          { phrase: 'J\'ai mangé', pronunciation: 'zhay mahn-ZHAY', translation: 'I ate', context: 'Past action', phonetic: '(ate)' },
          { phrase: 'Tu as bu', pronunciation: 'too AH bew', translation: 'You drank', context: 'Past action', phonetic: '(drank)' },
          { phrase: 'Il a vu', pronunciation: 'eel AH vew', translation: 'He saw', context: 'Past action', phonetic: '(saw)' },
          { phrase: 'Nous avons parlé', pronunciation: 'noo zah-VON par-LAY', translation: 'We spoke', context: 'Past action', phonetic: '(spoke)' },
          { phrase: 'Vous avez écouté', pronunciation: 'voo zah-VAY ay-koo-TAY', translation: 'You listened', context: 'Past action', phonetic: '(listened)' },
        ]
      },
      {
        id: 10,
        title: 'Past Tense: Passé Composé with Être',
        content: [
          { phrase: 'Je suis allé', pronunciation: 'zhuh SWEE ah-LAY', translation: 'I went (m)', context: 'Movement verb', phonetic: '(went)' },
          { phrase: 'Tu es venu', pronunciation: 'too ay vuh-NEW', translation: 'You came (m)', context: 'Movement verb', phonetic: '(came)' },
          { phrase: 'Elle est arrivée', pronunciation: 'EL ay tah-ree-VAY', translation: 'She arrived', context: 'Feminine form', phonetic: '(arrived)' },
          { phrase: 'Nous sommes partis', pronunciation: 'noo SUM par-TEE', translation: 'We left', context: 'Plural', phonetic: '(left)' },
          { phrase: 'Vous êtes restés', pronunciation: 'voo ET res-TAY', translation: 'You stayed', context: 'Formal plural', phonetic: '(stayed)' },
        ]
      },
      {
        id: 11,
        title: 'Hobbies & Interests',
        content: [
          { phrase: 'J\'aime...', pronunciation: 'zhem', translation: 'I like...', context: 'Positive preference', phonetic: '(like)' },
          { phrase: 'Je déteste...', pronunciation: 'zhuh day-TEST', translation: 'I hate...', context: 'Negative preference', phonetic: '(hate)' },
          { phrase: 'J\'adore...', pronunciation: 'zhah-DOR', translation: 'I love...', context: 'Strong positive', phonetic: '(love)' },
          { phrase: 'Je joue au football', pronunciation: 'zhuh ZHO oh foo-BOHL', translation: 'I play football', context: 'Sport', phonetic: '(sports)' },
          { phrase: 'Je lis un livre', pronunciation: 'zhuh LEE uhn LEE-vruh', translation: 'I read a book', context: 'Activity', phonetic: '(reading)' },
        ]
      },
      {
        id: 12,
        title: 'More Hobbies & Activities',
        content: [
          { phrase: 'Je regarde la télévision', pronunciation: 'zhuh ruh-GARD lah tay-lay-vee-ZYON', translation: 'I watch television', context: 'Leisure', phonetic: '(TV)' },
          { phrase: 'Je danse', pronunciation: 'zhuh DAHNS', translation: 'I dance', context: 'Activity', phonetic: '(dance)' },
          { phrase: 'Je fais du sport', pronunciation: 'zhuh FAY dew SPOR', translation: 'I do sports', context: 'Exercise', phonetic: '(sports)' },
          { phrase: 'Je vais au cinéma', pronunciation: 'zhuh VAY oh see-nay-MAH', translation: 'I go to the cinema', context: 'Entertainment', phonetic: '(movies)' },
          { phrase: 'Je surfe sur internet', pronunciation: 'zhuh SURF sewer in-ter-NAY', translation: 'I surf the internet', context: 'Technology', phonetic: '(internet)' },
        ]
      },
      {
        id: 13,
        title: 'Weather & Seasons',
        content: [
          { phrase: 'Quel temps fait-il?', pronunciation: 'kell tahn FAY-teel', translation: 'What\'s the weather like?', context: 'Asking weather', phonetic: '(weather)' },
          { phrase: 'Il fait beau', pronunciation: 'eel FAY BOH', translation: 'It\'s nice', context: 'Good weather', phonetic: '(nice)' },
          { phrase: 'Il fait froid', pronunciation: 'eel FAY FRWAH', translation: 'It\'s cold', context: 'Cold weather', phonetic: '(cold)' },
          { phrase: 'Il pleut', pronunciation: 'eel PLUH', translation: 'It\'s raining', context: 'Rainy', phonetic: '(rain)' },
          { phrase: 'Il neige', pronunciation: 'eel NEZH', translation: 'It\'s snowing', context: 'Snowy', phonetic: '(snow)' },
        ]
      },
      {
        id: 14,
        title: 'Adjectives & Descriptions',
        content: [
          { phrase: 'Grand', pronunciation: 'GRAHN', translation: 'Big/Tall', context: 'Size', phonetic: '(size)' },
          { phrase: 'Petit', pronunciation: 'puh-TEE', translation: 'Small/Short', context: 'Size', phonetic: '(size)' },
          { phrase: 'Bon', pronunciation: 'BOHN', translation: 'Good', context: 'Quality', phonetic: '(quality)' },
          { phrase: 'Mauvais', pronunciation: 'moh-VAY', translation: 'Bad', context: 'Quality', phonetic: '(quality)' },
          { phrase: 'Beau', pronunciation: 'BOH', translation: 'Beautiful/Handsome', context: 'Appearance', phonetic: '(appearance)' },
        ]
      },
      {
        id: 15,
        title: 'Negation & Questions',
        content: [
          { phrase: 'Ne...pas', pronunciation: 'nuh...pah', translation: 'Not', context: 'Negation structure', phonetic: '(negation)' },
          { phrase: 'Je ne suis pas fatigué', pronunciation: 'zhuh nuh SWEE pah fah-tee-GAY', translation: 'I am not tired', context: 'Negative sentence', phonetic: '(negative)' },
          { phrase: 'Avez-vous un stylo?', pronunciation: 'ah-vay-VOO uhn stee-LOH', translation: 'Do you have a pen?', context: 'Question', phonetic: '(question)' },
          { phrase: 'Pourquoi?', pronunciation: 'poor-KWAH', translation: 'Why?', context: 'Question word', phonetic: '(why)' },
          { phrase: 'Quand?', pronunciation: 'KAHN', translation: 'When?', context: 'Question word', phonetic: '(when)' },
        ]
      },
    ],
    advanced: [
      {
        id: 1,
        title: 'Conditional Mood: Formation',
        content: [
          { phrase: 'Je serais heureux', pronunciation: 'zhuh suh-RAY uh-RUH', translation: 'I would be happy', context: 'Conditional mood', phonetic: '(conditional)' },
          { phrase: 'Tu serais d\'accord', pronunciation: 'too suh-RAY dah-KOR', translation: 'You would agree', context: 'Conditional', phonetic: '(conditional)' },
          { phrase: 'Il parlerait français', pronunciation: 'eel par-luh-RAY frahn-SAY', translation: 'He would speak French', context: 'Conditional', phonetic: '(conditional)' },
          { phrase: 'Nous irions à Paris', pronunciation: 'noo zee-REE-ohn ah pah-REE', translation: 'We would go to Paris', context: 'Conditional', phonetic: '(conditional)' },
          { phrase: 'Vous feriez cela?', pronunciation: 'voo fuh-REE-ay suh-LAH', translation: 'Would you do that?', context: 'Question', phonetic: '(question)' },
        ]
      },
      {
        id: 2,
        title: 'Subjunctive Mood: Basics',
        content: [
          { phrase: 'Il faut que je parte', pronunciation: 'eel FOH kuh zhuh PART', translation: 'I must leave', context: 'Necessity', phonetic: '(necessity)' },
          { phrase: 'Je doute qu\'il vienne', pronunciation: 'zhuh DOOT keel vee-EN', translation: 'I doubt he will come', context: 'Doubt', phonetic: '(doubt)' },
          { phrase: 'Je veux que tu réussisses', pronunciation: 'zhuh VUH kuh too ray-oo-SEES', translation: 'I want you to succeed', context: 'Desire', phonetic: '(desire)' },
          { phrase: 'Il est possible que...', pronunciation: 'eel ay poh-SEE-bluh kuh', translation: 'It is possible that...', context: 'Possibility', phonetic: '(possibility)' },
          { phrase: 'C\'est important que tu comprennes', pronunciation: 'say im-POR-tahn kuh too kohm-PREN', translation: 'It\'s important that you understand', context: 'Importance', phonetic: '(importance)' },
        ]
      },
      {
        id: 3,
        title: 'Subjunctive with Common Verbs',
        content: [
          { phrase: 'Je voudrais que tu viennes', pronunciation: 'zhuh VOO-druh kuh too vee-EN', translation: 'I would like you to come', context: 'Desire', phonetic: '(desire)' },
          { phrase: 'Il craint que nous soyons en retard', pronunciation: 'eel KRAN kuh noo swah-YON ahn ruh-TAR', translation: 'He fears we are late', context: 'Fear', phonetic: '(fear)' },
          { phrase: 'À moins que tu changes', pronunciation: 'ah MWAN kuh too shahn-ZH', translation: 'Unless you change', context: 'Condition', phonetic: '(condition)' },
          { phrase: 'Pourvu que tu réussisses', pronunciation: 'poor-VEW kuh too ray-oo-SEES', translation: 'Provided that you succeed', context: 'Hope', phonetic: '(hope)' },
          { phrase: 'Bien que tu aies raison', pronunciation: 'bee-YEN kuh too ay RAY-zohn', translation: 'Although you are right', context: 'Concession', phonetic: '(concession)' },
        ]
      },
      {
        id: 4,
        title: 'Past Conditional & Imperfect',
        content: [
          { phrase: 'Si j\'avais su', pronunciation: 'see zhah-VAY sew', translation: 'If I had known', context: 'Hypothetical', phonetic: '(hypothetical)' },
          { phrase: 'J\'aurais pu venir', pronunciation: 'zho-RAY pew vuh-NEER', translation: 'I could have come', context: 'Possibility', phonetic: '(possibility)' },
          { phrase: 'Tu aurais dû partir', pronunciation: 'too oh-RAY dew par-TEER', translation: 'You should have left', context: 'Obligation', phonetic: '(obligation)' },
          { phrase: 'Il aurait voulu rester', pronunciation: 'eel oh-RAY voo-LEW res-TAY', translation: 'He would have wanted to stay', context: 'Wish', phonetic: '(wish)' },
          { phrase: 'Nous aurions pu réussir', pronunciation: 'noo oh-REE-ohn pew ray-oo-SEER', translation: 'We could have succeeded', context: 'Possibility', phonetic: '(possibility)' },
        ]
      },
      {
        id: 5,
        title: 'Imperfect Tense: Description & Habits',
        content: [
          { phrase: 'Je faisais', pronunciation: 'zhuh fuh-ZAY', translation: 'I was doing/used to do', context: 'Past habit', phonetic: '(past habit)' },
          { phrase: 'Tu allais', pronunciation: 'too ah-LAY', translation: 'You were going/used to go', context: 'Past habit', phonetic: '(past habit)' },
          { phrase: 'Il y avait', pronunciation: 'eel ee ah-VAY', translation: 'There was/were', context: 'Past existence', phonetic: '(existence)' },
          { phrase: 'Nous parlions', pronunciation: 'noo par-LEE-ohn', translation: 'We spoke/used to speak', context: 'Past habit', phonetic: '(past habit)' },
          { phrase: 'Quand j\'étais enfant', pronunciation: 'KAHN zhay-TAY ahn-FAHN', translation: 'When I was a child', context: 'Childhood memory', phonetic: '(childhood)' },
        ]
      },
      {
        id: 6,
        title: 'Relative Pronouns: Qui, Que, Où',
        content: [
          { phrase: 'L\'homme qui parle', pronunciation: 'LOHM kee PAR-luh', translation: 'The man who speaks', context: 'Relative pronoun subject', phonetic: '(who)' },
          { phrase: 'Le livre que j\'ai lu', pronunciation: 'luh LEE-vruh kuh zhay loo', translation: 'The book that I read', context: 'Relative pronoun object', phonetic: '(that)' },
          { phrase: 'La maison où j\'habite', pronunciation: 'lah may-ZOHN oo zhah-BEE', translation: 'The house where I live', context: 'Location pronoun', phonetic: '(where)' },
          { phrase: 'Ce dont tu parles', pronunciation: 'suh DOHN too PAR-luh', translation: 'What you\'re talking about', context: 'Relative pronoun', phonetic: '(what)' },
          { phrase: 'Les gens avec qui je travaille', pronunciation: 'lay ZHOHN ah-VEK kee zhuh trah-VAH', translation: 'The people with whom I work', context: 'Relative pronoun', phonetic: '(with whom)' },
        ]
      },
      {
        id: 7,
        title: 'Business French: Professional Greetings',
        content: [
          { phrase: 'Enchanté de vous rencontrer', pronunciation: 'on-shan-TAY duh voo rahn-kohn-TRAY', translation: 'Pleased to meet you', context: 'Formal greeting', phonetic: '(formal)' },
          { phrase: 'Je suis ravi de travailler avec vous', pronunciation: 'zhuh SWEE rah-VEE duh trah-vah-YAY ah-VEK voo', translation: 'I\'m delighted to work with you', context: 'Professional', phonetic: '(professional)' },
          { phrase: 'Merci de votre intérêt', pronunciation: 'mehr-SEE duh VOH-truh in-tay-RAY', translation: 'Thank you for your interest', context: 'Formal thanks', phonetic: '(formal thanks)' },
          { phrase: 'Je vous propose une réunion', pronunciation: 'zhuh voo proh-POHZ ewn ray-oo-NYON', translation: 'I suggest a meeting', context: 'Business proposal', phonetic: '(proposal)' },
          { phrase: 'Pouvons-nous discuter les détails?', pronunciation: 'POO-vohn-noo dees-kew-TAY lay day-TAH', translation: 'Can we discuss the details?', context: 'Business discussion', phonetic: '(discussion)' },
        ]
      },
      {
        id: 8,
        title: 'Business French: Negotiations & Projects',
        content: [
          { phrase: 'Quel est votre budget?', pronunciation: 'kell ay VOH-truh BEW-zhay', translation: 'What is your budget?', context: 'Financial', phonetic: '(financial)' },
          { phrase: 'Le délai est important', pronunciation: 'luh day-LAY ay im-POR-tahn', translation: 'The deadline is important', context: 'Project management', phonetic: '(deadline)' },
          { phrase: 'Nous devons être d\'accord', pronunciation: 'noo duh-VON ET dah-KOR', translation: 'We must agree', context: 'Negotiation', phonetic: '(agreement)' },
          { phrase: 'Pouvez-vous envoyer le contrat?', pronunciation: 'POO-vay-VOO ahn-vwah-YAY luh kohn-TRAH', translation: 'Can you send the contract?', context: 'Documentation', phonetic: '(contract)' },
          { phrase: 'J\'attends votre confirmation', pronunciation: 'zhah-TAHN VOH-truh kohn-feer-mah-SYON', translation: 'I await your confirmation', context: 'Formal closing', phonetic: '(confirmation)' },
        ]
      },
      {
        id: 9,
        title: 'Literary & Formal Speech',
        content: [
          { phrase: 'Auquel je me réfère', pronunciation: 'oh-KELL zhuh muh ray-FAIR', translation: 'To which I refer', context: 'Formal reference', phonetic: '(reference)' },
          { phrase: 'À l\'époque où j\'habitais', pronunciation: 'ah lay-POHK oo zhah-bee-TAY', translation: 'At the time when I lived', context: 'Historical context', phonetic: '(past time)' },
          { phrase: 'Cependant, il est évident', pronunciation: 'suh-pahn-DAHN, eel ay tay-vee-DAHN', translation: 'However, it is evident', context: 'Formal discourse', phonetic: '(however)' },
          { phrase: 'En conclusion', pronunciation: 'ahn kohn-kloo-ZYON', translation: 'In conclusion', context: 'Presentation ending', phonetic: '(conclusion)' },
          { phrase: 'D\'ailleurs', pronunciation: 'dah-YUR', translation: 'Moreover/Besides', context: 'Addition to argument', phonetic: '(moreover)' },
        ]
      },
      {
        id: 10,
        title: 'Complex Sentence Structures',
        content: [
          { phrase: 'Si vous aviez su, vous auriez agi différemment', pronunciation: 'see voo zah-VEE sew, voo zoh-REE ah-zhee dee-fay-RAHN', translation: 'If you had known, you would have acted differently', context: 'Complex conditional', phonetic: '(complex)' },
          { phrase: 'Non seulement il est intelligent, mais aussi très créatif', pronunciation: 'nohn suhl-MAHN eel ay tin-tel-ee-ZHAHN, may oh-SEE treh kray-ah-TEEF', translation: 'Not only is he intelligent, but also very creative', context: 'Complex structure', phonetic: '(complex)' },
          { phrase: 'Tant que tu ne comprends pas', pronunciation: 'TAHN kuh too nuh kohm-PRAHN pah', translation: 'As long as you don\'t understand', context: 'Temporal clause', phonetic: '(temporal)' },
          { phrase: 'À peine arrivé qu\'il pleuvait', pronunciation: 'ah PEN ah-ree-VAY keel PLUH-vay', translation: 'Hardly arrived when it rained', context: 'Literary structure', phonetic: '(literary)' },
        ]
      },
      {
        id: 11,
        title: 'Politics & Current Events',
        content: [
          { phrase: 'La politique française', pronunciation: 'lah poh-lee-TEEK frahn-SAY', translation: 'French politics', context: 'Government topic', phonetic: '(politics)' },
          { phrase: 'Les élections présidentielles', pronunciation: 'lay zay-lek-SYON pray-zee-dahn-SYEL', translation: 'Presidential elections', context: 'Political process', phonetic: '(elections)' },
          { phrase: 'Selon mon point de vue', pronunciation: 'suh-LOHN mohn pwahn duh VEW', translation: 'According to my point of view', context: 'Opinion', phonetic: '(opinion)' },
          { phrase: 'Il me semble que...', pronunciation: 'eel muh SAHN-bluh kuh', translation: 'It seems to me that...', context: 'Personal view', phonetic: '(seems)' },
          { phrase: 'D\'un autre côté', pronunciation: 'duh noh-truh koh-TAY', translation: 'On the other hand', context: 'Alternative view', phonetic: '(other hand)' },
        ]
      },
      {
        id: 12,
        title: 'Economics & Global Topics',
        content: [
          { phrase: 'L\'économie mondiale', pronunciation: 'lay-koh-noh-MEE mohn-dee-AHL', translation: 'The global economy', context: 'Economics', phonetic: '(economy)' },
          { phrase: 'Le marché financier', pronunciation: 'luh mar-SHAY fee-nahn-SYAY', translation: 'The financial market', context: 'Finance', phonetic: '(market)' },
          { phrase: 'Les taux d\'intérêt', pronunciation: 'lay TOH din-tay-RAY', translation: 'Interest rates', context: 'Banking', phonetic: '(rates)' },
          { phrase: 'Le taux de change', pronunciation: 'luh TOH duh SHANZH', translation: 'The exchange rate', context: 'Currency', phonetic: '(exchange)' },
          { phrase: 'L\'inflation augmente', pronunciation: 'lin-flah-SYON oh-MAHNT', translation: 'Inflation is rising', context: 'Economics', phonetic: '(inflation)' },
        ]
      },
      {
        id: 13,
        title: 'Idiomatic Expressions & Slang',
        content: [
          { phrase: 'C\'est une autre paire de manches', pronunciation: 'say ewn oh-truh PAIR duh MANSH', translation: 'That\'s another kettle of fish', context: 'Idiom', phonetic: '(idiom)' },
          { phrase: 'Avoir un chat dans la gorge', pronunciation: 'ah-VWAH uhn SHAH dahn lah GORZHUH', translation: 'To be hoarse', context: 'Idiom', phonetic: '(hoarse)' },
          { phrase: 'Tomber dans les pommes', pronunciation: 'tohm-BAY dahn lay POHM', translation: 'To faint', context: 'Idiom', phonetic: '(faint)' },
          { phrase: 'Être sur le même longueur d\'onde', pronunciation: 'ET sur luh MEM lohn-GUR DOND', translation: 'To be on the same wavelength', context: 'Idiom', phonetic: '(wavelength)' },
          { phrase: 'Avoir la tête dans les nuages', pronunciation: 'ah-VWAH lah TET dahn lay NEW-ahzh', translation: 'To have one\'s head in the clouds', context: 'Idiom', phonetic: '(daydreaming)' },
        ]
      },
      {
        id: 14,
        title: 'Advanced Grammar: Articles & Prepositions',
        content: [
          { phrase: 'Aller chez le médecin', pronunciation: 'ah-LAY shay luh med-san', translation: 'To go to the doctor\'s', context: 'Preposition usage', phonetic: '(preposition)' },
          { phrase: 'Penser à quelque chose', pronunciation: 'pehn-SAY ah KEL-kuh SHOZ', translation: 'To think of something', context: 'Verb + preposition', phonetic: '(verb+prep)' },
          { phrase: 'Se souvenir de', pronunciation: 'suh SOO-vuh-NEER duh', translation: 'To remember', context: 'Reflexive verb', phonetic: '(reflexive)' },
          { phrase: 'Compter sur quelqu\'un', pronunciation: 'KOHN-tay sur KEL-kuhn', translation: 'To count on someone', context: 'Verb phrase', phonetic: '(rely on)' },
          { phrase: 'S\'excuser auprès de', pronunciation: 'sek-skew-ZAY oh-PRAY duh', translation: 'To apologize to', context: 'Formal expression', phonetic: '(apologize)' },
        ]
      },
      {
        id: 15,
        title: 'Cultural & Literary References',
        content: [
          { phrase: 'Les Misérables de Victor Hugo', pronunciation: 'lay mee-zay-RAH-bluh duh VIK-tor YEW-go', translation: 'Les Misérables by Victor Hugo', context: 'Literature', phonetic: '(literature)' },
          { phrase: 'La culture française classique', pronunciation: 'lah kewl-TEWR frahn-SAY klah-SEE-kuh', translation: 'Classical French culture', context: 'Culture', phonetic: '(culture)' },
          { phrase: 'L\'art de la conversation', pronunciation: 'LAR duh lah kohn-ver-sah-SYON', translation: 'The art of conversation', context: 'Cultural value', phonetic: '(conversation)' },
          { phrase: 'Le patrimoine français', pronunciation: 'luh pah-tree-MWAN frahn-SAY', translation: 'French heritage', context: 'Culture', phonetic: '(heritage)' },
          { phrase: 'Les traditions culinaires', pronunciation: 'lay trah-dee-SYON kew-lee-NAY-ruh', translation: 'Culinary traditions', context: 'Food culture', phonetic: '(culinary)' },
        ]
      },
    ]
  };

  // Expanded Quiz
  const quizzes = {
    basic: [
      { question: 'What does "Bonjour" mean?', options: ['Goodbye', 'Hello', 'Good evening', 'See you'], correct: 1 },
      { question: 'How do you say "Thank you" in French?', options: ['S\'il vous plaît', 'Merci', 'Au revoir', 'Oui'], correct: 1 },
      { question: 'What is the French word for "One"?', options: ['Deux', 'Trois', 'Un', 'Quatre'], correct: 2 },
      { question: 'Which color is "Bleu"?', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 1 },
      { question: 'What does "Ça va?" mean?', options: ['Where are you?', 'What is your name?', 'How are you?', 'What time is it?'], correct: 2 },
      { question: 'How do you say goodbye?', options: ['Bonjour', 'Au revoir', 'Merci', 'Oui'], correct: 1 },
      { question: 'What color is "Rouge"?', options: ['Green', 'Red', 'Blue', 'Yellow'], correct: 1 },
      { question: 'What is "Jeudi"?', options: ['Monday', 'Friday', 'Thursday', 'Wednesday'], correct: 2 },
    ],
    intermediate: [
      { question: 'Conjugate "être" for "I am":', options: ['suis', 'suis je', 'je suis pas', 'être je'], correct: 0 },
      { question: 'How do you ask for the bill at a restaurant?', options: ['L\'addition, s\'il vous plaît', 'Un café', 'Je voudrais', 'Merci'], correct: 0 },
      { question: 'What does "J\'ai mangé" mean?', options: ['I eat', 'I will eat', 'I ate', 'I am eating'], correct: 2 },
      { question: 'What is the past participle of "aller"?', options: ['allé', 'aller', 'allais', 'irai'], correct: 0 },
      { question: 'How do you say "Where is the station?"', options: ['Où est la gare?', 'Où sont les gares?', 'Quelle gare?', 'La gare où?'], correct: 0 },
      { question: 'What does "Je voudrais" mean?', options: ['I have', 'I want', 'I would like', 'I need'], correct: 2 },
      { question: 'Translate "We spoke": ', options: ['Nous parlons', 'Nous avons parlé', 'Nous parlerions', 'Nous parlions'], correct: 1 },
      { question: 'What does "Il fait beau" mean?', options: ['It\'s raining', 'It\'s nice weather', 'It\'s cold', 'It\'s hot'], correct: 1 },
    ],
    advanced: [
      { question: 'Which sentence uses the subjunctive correctly?', options: ['Je crois qu\'il est là', 'Je pense qu\'il soit là', 'Il faut qu\'il soit là', 'Je sais qu\'il soit là'], correct: 2 },
      { question: 'Complete: "Si j\'avais su, je ___"', options: ['irais', 'serais allé', 'vais', 'allais'], correct: 1 },
      { question: 'What is the conditional of "faire"?', options: ['ferais', 'ferai', 'faisait', 'fait'], correct: 0 },
      { question: 'Which is a relative pronoun?', options: ['que', 'quand', 'combien', 'pourquoi'], correct: 0 },
      { question: 'What does "Auquel" refer to?', options: ['A person', 'A feminine noun', 'A masculine noun (after preposition)', 'A place'], correct: 2 },
      { question: 'In business French, "Enchanté" means:', options: ['Tired', 'Pleased to meet you', 'Confused', 'Happy'], correct: 1 },
      { question: 'What is the imperfect tense used for?', options: ['Future actions', 'Past habits/descriptions', 'Commands', 'Completed actions'], correct: 1 },
      { question: 'Which idiom means to faint?', options: ['Tomber dans les pommes', 'Avoir un chat', 'Être fatigué', 'Avoir froid'], correct: 0 },
    ]
  };

  const searchDictionary = () => {
    if (searchTerm.trim() === '') {
      setDictionaryResults([]);
      return;
    }
    const results = frenchDictionary.filter(entry =>
      entry.french.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.english.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDictionaryResults(results);
  };

  const completeMilestone = (level) => {
    const newCompletedLessons = { ...completedLessons, [level]: true };
    setCompletedLessons(newCompletedLessons);
    setCertificates([...certificates, { level, date: new Date().toLocaleDateString() }]);
  };

  const handleQuizSubmit = (score) => {
    setQuizScore(score);
    if (score >= 6) {
      completeMilestone(userLevel);
    }
  };

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">FrenchFlow</h1>
            </div>
            <p className="text-gray-600">🎙️ Master French with Pronunciation Guides</p>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Welcome to FrenchFlow</h2>
          <p className="text-xl text-gray-600 mb-2">Learn French from basics to advanced level, completely free!</p>
          <p className="text-lg text-blue-600 font-semibold mb-8">🔊 Click the sound icon to hear pronunciations!</p>
          
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">45</div>
              <p className="text-gray-600">Lessons Total</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">140+</div>
              <p className="text-gray-600">Dictionary Words</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
              <p className="text-gray-600">With Pronunciation</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Level</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => { setUserLevel('basic'); setCurrentPage('lessons'); }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-8 border-2 border-blue-200 hover:border-blue-500"
            >
              <div className="text-5xl mb-4">🌱</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Basic</h4>
              <p className="text-gray-600 mb-4">Perfect for beginners. Learn greetings, numbers, colors, and daily phrases.</p>
              <div className="text-sm text-blue-600 font-semibold">15 Lessons • 8 Quiz Questions</div>
            </div>

            <div 
              onClick={() => { setUserLevel('intermediate'); setCurrentPage('lessons'); }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-8 border-2 border-purple-200 hover:border-purple-500 transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Intermediate</h4>
              <p className="text-gray-600 mb-4">Build on basics. Master verb tenses, travel, food, and real conversations.</p>
              <div className="text-sm text-purple-600 font-semibold">15 Lessons • 8 Quiz Questions</div>
            </div>

            <div 
              onClick={() => { setUserLevel('advanced'); setCurrentPage('lessons'); }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-8 border-2 border-pink-200 hover:border-pink-500"
            >
              <div className="text-5xl mb-4">👑</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Advanced</h4>
              <p className="text-gray-600 mb-4">Reach fluency. Business French, subjunctive, idioms, and culture.</p>
              <div className="text-sm text-pink-600 font-semibold">15 Lessons • 8 Quiz Questions</div>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">🔊 French Dictionary with Pronunciation</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search French or English words..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length > 0) searchDictionary();
                }}
                onKeyPress={(e) => e.key === 'Enter' && searchDictionary()}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={searchDictionary}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {dictionaryResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {dictionaryResults.map((entry, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{entry.french}</span>
                        <p className="text-gray-700 font-semibold">{entry.english}</p>
                      </div>
                      <button
                        onClick={() => speakText(entry.french)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition ml-2"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded">
                      📝 {entry.pronunciation}
                    </p>
                    <p className="text-xs text-gray-500 italic mt-2">{entry.guide}</p>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && dictionaryResults.length === 0 && (
              <p className="text-gray-500 mt-4">No words found. Try a different search!</p>
            )}
          </div>

          {certificates.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-8 h-8 text-yellow-500" />
                Your Certificates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {certificates.map((cert, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-2 border-yellow-400 text-center">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <p className="font-bold text-gray-800 capitalize">{cert.level} Level</p>
                    <p className="text-sm text-gray-600">Completed: {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lessons Page
  if (currentPage === 'lessons') {
    const currentLessonData = lessons[userLevel][currentLesson];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => { setCurrentPage('home'); setUserLevel(null); setQuizScore(null); }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Level - FrenchFlow
            </h1>
            <div></div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Lesson {currentLesson + 1} of {lessons[userLevel].length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentLesson + 1) / lessons[userLevel].length) * 100}%` }}
              ></div>
            </div>
          </div>

          {quizScore === null ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {currentLessonData.title}
                  </h2>

                  <div className="space-y-6">
                    {currentLessonData.content.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-blue-600">{item.phrase}</p>
                              <button
                                onClick={() => speakText(item.phrase)}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                                title="Click to hear pronunciation"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 font-mono bg-white px-3 py-1 rounded inline-block mb-2">
                              📝 {item.pronunciation}
                            </p>
                            <p className="text-lg text-gray-700 font-semibold mt-2">{item.translation}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 italic">Context: {item.context}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                      disabled={currentLesson === 0}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
                    >
                      ← Previous
                    </button>
                    
                    {currentLesson === lessons[userLevel].length - 1 ? (
                      <button
                        onClick={() => setCurrentPage('quiz')}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        Take Quiz →
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentLesson(currentLesson + 1)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Words 🎙️</h3>
                <div className="space-y-3">
                  {currentLessonData.content.map((item, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded-lg border-l-2 border-blue-500">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-blue-600">{item.phrase}</p>
                          <p className="text-xs text-gray-500 font-mono">{item.pronunciation}</p>
                          <p className="text-sm text-gray-600">{item.translation}</p>
                        </div>
                        <button
                          onClick={() => speakText(item.phrase)}
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition flex-shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
              {quizScore >= 6 ? (
                <div>
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Excellent! 🎉</h2>
                  <p className="text-xl text-gray-600 mb-2">Your Score: {quizScore}/8</p>
                  <p className="text-gray-600 mb-8">You've passed the quiz and earned your certificate!</p>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8 mb-8 border-2 border-yellow-400">
                    <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-800 capitalize mb-2">{userLevel} Level Certificate</p>
                    <p className="text-gray-600">Congratulations on completing this milestone!</p>
                  </div>
                </div>
              ) : (
                <div>
                  <AlertCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Keep Trying! 💪</h2>
                  <p className="text-xl text-gray-600 mb-2">Your Score: {quizScore}/8</p>
                  <p className="text-gray-600 mb-8">You need 6 or more correct answers to pass. Review the lessons and try again!</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setUserLevel(null);
                    setQuizScore(null);
                    setCurrentLesson(0);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Go Home
                </button>
                <button
                  onClick={() => {
                    setQuizScore(null);
                    setCurrentLesson(0);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  Review Lessons
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz Page
  if (currentPage === 'quiz') {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    const quiz = quizzes[userLevel];
    const totalQuestions = quiz.length;

    const handleAnswer = (index) => {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = index;
      setSelectedAnswers(newAnswers);
    };

    const handleSubmit = () => {
      let score = 0;
      selectedAnswers.forEach((answer, idx) => {
        if (answer === quiz[idx].correct) score++;
      });
      handleQuizSubmit(score);
      setCurrentPage('lessons');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Quiz Time! 📝</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {totalQuestions}</p>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {quiz[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {quiz[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <span className="font-semibold text-gray-800">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
            >
              ← Previous
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
              >
                Next Question →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
