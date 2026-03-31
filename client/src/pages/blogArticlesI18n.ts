// Multilingual blog articles — EN and ES translations
// PT-BR content is in Blog.tsx (blogArticlesData)

export interface BlogArticleTranslation {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  readTime: string;
}

export const blogArticlesEN: BlogArticleTranslation[] = [
  {
    slug: "baby-wont-sleep",
    title: "Baby Won't Sleep: Complete Guide by Age (0 to 12 Months)",
    excerpt: "Understand sleep windows, bedtime routines, and AAP-backed techniques to help your baby sleep better at every stage.",
    readTime: "8 min read",
    metaTitle: "Baby Won't Sleep: Complete Guide by Age | Wilbor",
    metaDescription: "Baby sleep guide based on AAP protocols. Learn sleep windows, routines, and techniques for 0-12 months.",
    keywords: ["baby sleep", "newborn sleep", "baby sleep schedule", "sleep regression", "baby won't sleep"],
    content: `## Why Won't My Baby Sleep?

Baby sleep is one of the biggest concerns for mothers worldwide. According to the **American Academy of Pediatrics (AAP)**, sleep patterns vary significantly by age, and understanding these phases is the first step toward more peaceful nights.

## Sleep Windows by Age

A **sleep window** is the maximum amount of time your baby can stay awake before becoming irritable and having difficulty falling asleep. Respecting this window is fundamental.

| Age | Sleep Window | Total Sleep/Day | Naps |
|-----|--------------|-----------------|------|
| 0-1 month | 45-60 min | 16-18h | 4-6 |
| 1-2 months | 60-90 min | 15-17h | 4-5 |
| 3-4 months | 75-120 min | 14-16h | 3-4 |
| 5-6 months | 2-2.5h | 14-15h | 2-3 |
| 7-9 months | 2.5-3h | 13-14h | 2 |
| 10-12 months | 3-4h | 12-14h | 1-2 |

## Sleep Cues

Watch for signs that indicate your baby is ready to sleep: rubbing eyes, yawning, fixed gaze, and pulling ears are early signs. Late signs include crying, irritability, jerky movements, and arching back. When you notice late signs, your baby has already passed the ideal window. Try putting them down for sleep at the first signs.

## Techniques to Improve Sleep

### Ideal Environment
Maintain a temperature between 72°F and 75°F (22°C–24°C), use blackout curtains for darkness, incorporate white noise from a fan or app, and always place baby on their back, following AAP recommendations.

### Sleep Routine (starting at 2-3 months)
Begin with a warm bath (not hot), followed by gentle massage with slow movements, feeding in a calm and dark environment, a lullaby or white noise, and finally place baby in crib drowsy but awake.

### Sleep Regression (4 months)
Around 4 months, many babies experience a **sleep regression**. This happens because their sleep pattern is maturing. It's temporary (1-3 weeks) and part of normal development.

## When to Contact Your Pediatrician

- Baby snores or has pauses in breathing during sleep
- Doesn't sleep more than 30 minutes straight after 4 months
- Extreme irritability that doesn't improve with any technique
- Weight loss or feeding refusal associated with sleep issues

---
**Source:** American Academy of Pediatrics (AAP) protocols.`,
  },
  {
    slug: "baby-colic-relief",
    title: "Baby Colic: What to Do to Relieve It (Practical Guide)",
    excerpt: "Proven techniques to soothe colic in newborns. Massage, positions, and what the AAP says about infant crying.",
    readTime: "7 min read",
    metaTitle: "Baby Colic Relief: Proven Techniques | Wilbor",
    metaDescription: "Practical guide to relieve baby colic based on AAP protocols. Massage, positions, and when to call the doctor.",
    keywords: ["baby colic", "infant colic relief", "colic baby", "newborn crying", "baby gas relief"],
    content: `## What Is Baby Colic?

Infant colic affects approximately **20-25% of babies** and is characterized by intense, inconsolable crying, usually in the late afternoon or evening, in healthy, well-fed babies.

According to the **Wessel Rule** (adopted by the AAP), colic is defined as crying for more than **3 hours per day**, more than **3 days per week**, for more than **3 consecutive weeks**.

## Why Do Babies Get Colic?

The causes are not fully understood, but the most accepted theories include:

- **Immature digestive system** — the intestine is still learning to function
- **Intestinal gas** — difficulty eliminating gas
- **Environmental hypersensitivity** — excessive light, sound, and movement stimuli
- **Reflux** — in some cases may be associated
- **Lactose intolerance** — rare but possible

## Techniques to Relieve Colic

### Abdominal Massage (I-L-U)
Make gentle movements on baby's belly with your finger:
1. **I** — vertical movement downward on the right side
2. **L** — horizontal movement from right to left, then down
3. **U** — U-shaped movement, going up on the left side

### Football Hold Position
Lay baby face down on your forearm, with belly supported and head in the crook of your elbow. The slight pressure on the belly helps eliminate gas.

### Heat on the Belly
Place a warm (not hot) folded cloth diaper on baby's belly while holding them.

### Movement and White Noise
- Walk with baby in arms or stroller
- "Shhhh" sounds near baby's ear
- Gentle vibration (car ride, hair dryer far from baby)

### Breastfeeding and Maternal Diet
If breastfeeding, try temporarily reducing:
- Dairy products (main suspect)
- Caffeine (coffee, black tea, sodas)
- Broccoli, cauliflower, cabbage (produce gas)

## What NOT to Do
- ❌ Don't give herbal teas — no evidence and contamination risk
- ❌ Don't give medications without medical prescription
- ❌ Don't shake the baby — risk of shaken baby syndrome

## When to Contact Your Pediatrician
- Crying associated with fever (above 100.4°F / 38°C)
- Baby refuses feeding
- Weight loss
- Blood in stool
- Frequent and intense vomiting
- Colic that worsens after 3-4 months

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-fever-guide",
    title: "Baby Fever: When to Go to the Hospital (Guide by Age)",
    excerpt: "Learn when fever is an emergency, how to measure correctly, and AAP guidelines for treating fever at home.",
    readTime: "6 min read",
    metaTitle: "Baby Fever: When to Go to the Hospital | Wilbor",
    metaDescription: "AAP-based guide on baby fever by age. Learn when to go to the ER, how to treat at home, and warning signs.",
    keywords: ["baby fever", "infant fever", "newborn fever", "when to go to hospital baby fever", "baby temperature"],
    content: `## When Is Fever an Emergency?

Fever is a defense mechanism of the body, not a disease. However, in young babies, it can indicate serious infections that need immediate attention.

## Fever Definition by Measurement Method

| Method | Normal Temperature | Fever |
|--------|-------------------|-------|
| Rectal (most accurate) | up to 99.5°F (37.5°C) | ≥ 100.4°F (38°C) |
| Axillary | up to 97.7°F (36.5°C) | ≥ 99.5°F (37.5°C) |
| Oral | up to 98.6°F (37°C) | ≥ 100°F (37.8°C) |
| Tympanic (ear) | up to 99.5°F (37.5°C) | ≥ 100.4°F (38°C) |

**AAP Recommendation:** Use a digital rectal thermometer for the most accurate reading in infants.

## Fever by Age: When to Go to the ER

### Newborn (0-28 days)
**Any fever above 100.4°F (38°C) = emergency.** Go to the ER immediately. Do not wait. Do not give medication before consulting.

### 1-3 months
Fever above **100.4°F (38°C)** = medical consultation within a few hours (don't wait until the next day).

### 3-6 months
- Fever above **102.2°F (39°C)** = medical consultation
- Fever with other symptoms (inconsolable crying, rash, breathing difficulty) = emergency

### 6-12 months
- Fever above **103.1°F (39.5°C)** that doesn't respond to medication
- Fever lasting more than **3 days**
- Any warning sign (see below)

## Warning Signs (Go to the ER Immediately)
- Purple or red spots that don't fade when pressed
- Difficulty breathing or very rapid breathing
- Inconsolable crying for more than 2 hours
- Baby very drowsy, difficult to wake
- Stiff neck
- Seizure
- Bulging fontanelle (soft spot)

## How to Treat Fever at Home

### Medications
- **Acetaminophen (Tylenol):** 10-15mg/kg every 4-6 hours. Can be given from 3 months.
- **Ibuprofen:** 5-10mg/kg every 6-8 hours. Only from 6 months.
- **Never give aspirin** to children — risk of Reye's syndrome.

### Physical Measures
- Light clothing
- Ventilated (not cold) environment
- Offer fluids frequently (breast milk, water from 6 months)
- Lukewarm bath (not cold) — can help reduce discomfort

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-food-introduction",
    title: "Baby Food Introduction: Complete Guide (BLW and Traditional)",
    excerpt: "When to start solids, BLW vs traditional method, safe first foods, and allergen introduction based on AAP guidelines.",
    readTime: "10 min read",
    metaTitle: "Baby Food Introduction: Complete Guide | Wilbor",
    metaDescription: "Complete guide to starting solids at 6 months. BLW vs traditional, first foods, allergens, and AAP recommendations.",
    keywords: ["baby food introduction", "starting solids", "BLW baby", "first foods baby", "baby led weaning"],
    content: `## When to Start?

The **World Health Organization (WHO)** and the **American Academy of Pediatrics (AAP)** recommend starting solid foods at **6 months**, while continuing breastfeeding until 2 years or more.

### Readiness Signs (all must be present):
- Holds head steady without support
- Sits with minimal support
- Shows interest in adults' food
- Lost the extrusion reflex (doesn't push everything out with tongue)

## BLW vs. Traditional Method

| Aspect | BLW (Baby-Led Weaning) | Traditional Method |
|---------|------------------------|-------------------|
| Initial texture | Soft food pieces | Purees and mashes |
| Control | Baby controls intake | Parents spoon-feed |
| Autonomy | High from the start | Gradual |
| Choking risk | Equal to traditional (with supervision) | Equal to BLW |
| AAP recommendation | Accepted | Accepted |

**Tip:** You can combine both methods (mixed method or BLISS).

## Foods by Phase

### 6 months — First Foods
- Soft cooked vegetables: carrots, sweet potato, zucchini
- Soft fruits: banana, mango, cooked pear, avocado
- Proteins: shredded chicken, ground beef, well-cooked egg
- Grains: rice, pasta, oatmeal

### 7-8 months — Expanding Variety
- Introduce one new food every 3-5 days
- Legumes: beans, lentils, chickpeas (mashed)
- Fish: tilapia, salmon (boneless)
- Plain whole-milk yogurt

### 9-12 months — Family Texture
- Gradually move to family food texture
- Avoid only: honey, excess salt, sugar, fried foods

## Foods Prohibited Before 1 Year

| Food | Reason |
|------|--------|
| Honey | Risk of infant botulism |
| Cow's milk as main drink | Hard to digest protein, low in iron |
| Salt | Immature kidneys |
| Sugar | Poor eating habits, cavities |
| Ultra-processed foods | Harmful additives |
| Whole peanuts | Choking risk |
| Large fish (tuna, swordfish) | High mercury content |

## Allergens: Introduce Early!

Contrary to previous belief, early allergen introduction **reduces** allergy risk. Introduce individually, with 3-day intervals:
- Egg (white and yolk)
- Peanut (paste/butter)
- Cow's milk (in preparations)
- Wheat
- Fish
- Soy

## Gagging vs. Choking

**Gagging:** baby makes sounds, turns red, but is controlling the food. It is **normal and safe** — don't interfere.

**Real choking:** baby turns blue/purple, no sound, can't breathe. **Act immediately** with infant Heimlich maneuver.

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "postpartum-depression",
    title: "Postpartum Depression: Signs, When to Seek Help, and What to Do",
    excerpt: "Postpartum depression affects 10-20% of mothers. Learn the signs, risk factors, and where to find help.",
    readTime: "8 min read",
    metaTitle: "Postpartum Depression: Signs and Help | Wilbor",
    metaDescription: "Complete guide on postpartum depression. Signs, risk factors, treatment, and where to find free help.",
    keywords: ["postpartum depression", "baby blues", "PPD symptoms", "postpartum anxiety", "new mom depression"],
    content: `## You Are Not Alone

**Postpartum depression (PPD)** affects between **10% and 20% of mothers** worldwide, according to WHO. It is a real medical condition, not a character weakness.

## Baby Blues vs. Postpartum Depression

| Characteristic | Baby Blues | Postpartum Depression |
|----------------|------------|----------------------|
| Onset | 2-3 days after birth | 2-8 weeks after birth |
| Duration | Up to 2 weeks | Months without treatment |
| Intensity | Mild to moderate | Moderate to severe |
| Functionality | Maintained | Compromised |
| Treatment | Support and rest | Professional needed |

## Signs of Postpartum Depression

- Persistent sadness, frequent crying without apparent reason
- Feelings of guilt or inadequacy as a mother
- Thoughts that the baby would be better off without you
- Intense anxiety, panic attacks
- Difficulty bonding with the baby
- Social isolation (refusing visitors, not leaving home)
- Loss of interest in previously enjoyed activities
- Difficulty concentrating

## Risk Factors

- Personal or family history of depression
- Unplanned pregnancy
- Lack of support network
- Birth complications
- Premature baby or baby with health problems
- Financial difficulties
- Domestic violence

## What to Do

### For the Mother
1. **Recognize you need help** — it's not weakness
2. **Talk to someone** — partner, mother, friend, professional
3. **Seek a therapist or psychiatrist** — many insurance plans cover mental health
4. **Don't stop medication on your own** if already in treatment
5. **Accept practical help** — let someone care for the baby while you rest

### For Those Around Her
1. **Don't minimize** ("it'll pass", "it's just tiredness")
2. **Offer concrete help** (cooking, cleaning, caring for baby)
3. **Encourage seeking professional help**
4. **Be present** without judgment

## Where to Get Help (USA)
- **Postpartum Support International:** 1-800-944-4773 or postpartum.net
- **SAMHSA National Helpline:** 1-800-662-4357 (free, confidential)
- **Crisis Text Line:** Text HOME to 741741
- **National Suicide Prevention Lifeline:** 988

## Treatment

- **Psychotherapy** (cognitive-behavioral therapy is most studied)
- **Medication** (antidepressants safe for breastfeeding exist)
- **Support groups** (sharing experiences with other mothers helps)
- **Physical exercise** (light walks make a difference)

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-vaccination-schedule",
    title: "Baby Vaccination Schedule: Complete Calendar and Expected Reactions",
    excerpt: "Complete CDC/AAP vaccination schedule for 0-12 months, expected reactions, and when to call the doctor.",
    readTime: "7 min read",
    metaTitle: "Baby Vaccination Schedule: Complete Guide | Wilbor",
    metaDescription: "Complete CDC/AAP vaccination schedule for babies 0-12 months. Expected reactions and when to seek medical care.",
    keywords: ["baby vaccination schedule", "infant vaccines", "CDC vaccine schedule", "baby shots", "newborn vaccines"],
    content: `## Baby Vaccination Schedule (0-12 months)

The **CDC/AAP recommended immunization schedule** provides the best protection for your baby. Most vaccines are covered by insurance and available free at community health centers.

## Vaccines by Age

| Age | Vaccine | Protects Against |
|-----|---------|-----------------|
| Birth | HepB (1st dose) | Hepatitis B |
| 2 months | DTaP (1st dose) | Diphtheria, tetanus, whooping cough |
| 2 months | IPV (1st dose) | Polio |
| 2 months | Hib (1st dose) | Haemophilus influenzae type b |
| 2 months | PCV15/PCV20 (1st dose) | Pneumococcal disease |
| 2 months | RV (1st dose) | Rotavirus |
| 4 months | DTaP, IPV, Hib, PCV, RV (2nd doses) | Boosters |
| 6 months | DTaP, IPV, HepB (3rd doses) | Boosters |
| 6 months | Flu (annual) | Influenza |
| 12 months | MMR (1st dose) | Measles, mumps, rubella |
| 12 months | Varicella (1st dose) | Chickenpox |
| 12 months | HepA (1st dose) | Hepatitis A |

## Expected Reactions (Normal)

After vaccination, it's common for baby to have:
- **Low-grade fever** (up to 101.3°F/38.5°C) in the first 24-48 hours
- **Redness and swelling** at the injection site
- **Irritability** and more frequent crying
- **Drowsiness** or appetite changes

### How to Relieve
- **Cold compress** at the injection site (no direct ice)
- **Acetaminophen** at the dose prescribed by the pediatrician (if fever above 100.4°F/38°C)
- **Breastfeed** more frequently (comfort + hydration)
- **Light clothing** and cool environment

## When to Contact Pediatrician After Vaccine
- Fever above **104°F (40°C)** or lasting more than 48 hours
- **Inconsolable crying** for more than 3 hours
- **Seizure**
- **Extensive swelling** in the vaccinated limb
- **Purple spots** on the body

## Frequently Asked Questions

### Can a sick baby get vaccinated?
If it's a mild cold (runny nose, mild cough, no fever), **yes, vaccinate**. With fever or moderate/severe illness, postpone until recovery.

### Do premature babies follow the same schedule?
Yes, premature babies follow the schedule by **chronological age** (date of birth).

---
**Source:** CDC, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "breastfeeding-latch-guide",
    title: "Breastfeeding: Correct Latch, Positions, and Common Difficulties",
    excerpt: "Master the correct latch, best breastfeeding positions, and solutions to common challenges like engorgement and mastitis.",
    readTime: "9 min read",
    metaTitle: "Breastfeeding Latch Guide: Positions and Tips | Wilbor",
    metaDescription: "Complete breastfeeding guide: correct latch, positions, engorgement, mastitis, and low milk supply solutions.",
    keywords: ["breastfeeding latch", "breastfeeding positions", "breastfeeding tips", "mastitis", "low milk supply"],
    content: `## The Importance of Breastfeeding

**Breast milk** is the ideal food for babies in the first 6 months of life. The WHO and AAP recommend:
- **Exclusive breastfeeding** until 6 months (no water, teas, or other foods)
- **Complementary breastfeeding** until 2 years or more

Proven benefits:
- Reduces risk of sudden infant death syndrome by 50%
- Protects against respiratory infections and diarrhea
- Reduces risk of obesity, diabetes, and allergies
- Strengthens mother-baby bond

## The Correct Latch

An incorrect latch is the main cause of breastfeeding pain and low milk production.

### Signs of Correct Latch ✓
- Mouth wide open (120° angle or more)
- Lower lip turned outward
- Chin touching the breast
- More areola visible above than below the mouth
- Rounded cheeks (not sunken)
- You hear swallowing, not clicking

### Signs of Incorrect Latch ✗
- Intense pain throughout the entire feeding
- Nipple flattened or with marks when released
- Baby makes clicking sounds
- Sunken cheeks
- Baby seems frustrated and frequently releases the breast

### How to Correct the Latch
1. Insert your little finger in the corner of baby's mouth to break the suction
2. Reposition: bring baby close, belly to belly
3. Wait for mouth to open wide before latching
4. Direct the nipple toward the palate (roof of mouth), not the tongue

## Breastfeeding Positions

### Cradle Hold (Classic)
Baby lying on your arm, belly to belly. Good for older babies.

### Football Hold
Baby at your side, under your arm, with legs behind. Excellent for:
- Post-cesarean (avoids pressure on abdomen)
- Premature babies
- Large breasts

### Side-Lying Position
Mother and baby lying on their sides, face to face. Ideal for night feedings.

### Reclined Position (Biological Nurturing)
Mother reclined, baby lying on top. Takes advantage of baby's rooting reflex.

## Common Difficulties

### Engorgement (Hard, Swollen Breasts)
Occurs in the first days when milk "comes in."
- **Relief:** breastfeed frequently, warm compress before, cold compress after
- **Don't:** express too much milk (worsens engorgement)

### Nipple Cracks/Soreness
- Check the latch — it's the most common cause
- Apply breast milk to the nipple after feeding and let dry
- Use pure lanolin (Lansinoh) if necessary
- Don't use soap on the nipple

### Mastitis
Breast inflammation with fever and intense pain.
- Continue breastfeeding (doesn't harm baby)
- Warm compress and gentle massage
- See your doctor — may need antibiotics

### Low Milk Supply
In most cases, production is sufficient. Signs baby is well-nourished:
- 6+ wet diapers per day
- Gaining weight as expected
- Active and satisfied after feedings

To increase production: breastfeed more often, fully empty the breast, stay well-hydrated.

---
**Source:** WHO, American Academy of Pediatrics (AAP), UNICEF.`,
  },
  {
    slug: "baby-safety-home",
    title: "Baby Safety at Home: Accident Prevention by Age",
    excerpt: "Room-by-room safety checklist, prevention by accident type, and what to do in emergencies — AAP guidelines.",
    readTime: "8 min read",
    metaTitle: "Baby Safety at Home: Complete Checklist | Wilbor",
    metaDescription: "Complete baby safety guide by room and age. Prevent falls, choking, poisoning, and drowning with AAP guidelines.",
    keywords: ["baby safety", "baby proofing", "infant safety home", "baby accident prevention", "childproofing"],
    content: `## Domestic Accidents: The Leading Preventable Cause of Death

Domestic accidents are the **leading preventable cause of death** in children under 5. The good news: most are 100% preventable.

## Room-by-Room Checklist

### Baby's Room ✓
- [ ] Crib with firm rails (maximum 2.375 inches / 6cm between slats)
- [ ] Firm mattress, no pillow, no bumpers, no stuffed animals in crib
- [ ] Baby always sleeps on back (face up)
- [ ] Room temperature between 68-72°F (20-22°C)
- [ ] Baby monitor installed
- [ ] Outlet covers
- [ ] Curtains without cords (strangulation risk)

### Kitchen ✓
- [ ] Locks on low drawers and cabinets
- [ ] Pot handles always turned inward
- [ ] Cleaning products in high cabinet with lock
- [ ] Trash with lid and inaccessible location
- [ ] Stove and oven with protection

### Bathroom ✓
- [ ] Never leave baby alone in the tub (not even for 1 second)
- [ ] Non-slip mat in tub and on floor
- [ ] Water temperature: 98-100°F / 37-38°C (test with elbow)
- [ ] Medications in high cabinet with lock
- [ ] Hygiene products out of reach

### Living Room and Hallways ✓
- [ ] Safety gates at stairs (top and bottom)
- [ ] Furniture corner protectors
- [ ] Small objects out of reach (choking risk)
- [ ] Toxic plants removed or inaccessible
- [ ] Electrical cords organized and out of reach

## Prevention by Accident Type

### Falls (most common at 6-12 months)
- Never leave baby on elevated surface without supervision
- Use playpen on floor for playtime
- Install gates at stairs before baby starts crawling

### Choking (risk increases with food introduction)
High-risk foods: whole grapes, cherries, whole peanuts, raw carrots, raw apple in large pieces, hot dogs.
- Always cut into small pieces or remove skin
- Learn infant Heimlich maneuver

### Drowning
- Never leave alone in the tub
- Empty inflatable pools after use
- Risk in buckets, basins, toilets

### Poisoning
- Medications are the leading cause
- Store EVERYTHING in a high, locked location
- **Poison Control Center: 1-800-222-1222** (USA, 24/7)

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-developmental-leaps",
    title: "Baby Developmental Leaps: What to Expect Month by Month",
    excerpt: "Understand developmental milestones, wonder weeks, and how to support your baby through each leap.",
    readTime: "9 min read",
    metaTitle: "Baby Developmental Leaps: Month by Month Guide | Wilbor",
    metaDescription: "Complete guide to baby developmental milestones and wonder weeks. What to expect from 1-12 months.",
    keywords: ["baby developmental leaps", "wonder weeks", "baby milestones", "infant development", "baby growth spurts"],
    content: `## What Are Developmental Leaps?

**Developmental leaps** (also called growth spurts or wonder weeks) are periods when babies go through intense neurological changes. During these periods, it's common to see:
- Excessive crying and irritability
- Sleep regression
- Increased demand for holding and attention
- Temporary feeding refusal

**Important:** These periods are temporary and indicate your baby is developing normally.

## Developmental Milestones by Month

### 1 Month
- Focuses gaze on faces (especially at 8-12 inches / 20-30cm)
- Reacts to loud sounds
- Reflex movements (sucking, grasping)

### 2 Months
- **First social smile** (not gas!)
- Begins vocalizing ("ah", "oh")
- Follows objects with eyes

### 3 Months
- Holds head up for longer periods
- Smiles in response to adult's smile
- Recognizes familiar voices

### 4 Months
- **Sleep regression** (important neurological milestone)
- Laughs out loud
- Tries to reach for objects

### 5-6 Months
- Sits with support
- Transfers objects from one hand to another
- Recognizes own name

### 7-8 Months
- **Separation anxiety** begins
- Crawls (some babies skip this phase)
- Imitates sounds and gestures

### 9-10 Months
- Stands with support
- Pincer grasp (picks up small objects with thumb and index finger)
- Understands "no" and "bye-bye"

### 11-12 Months
- First steps (can vary from 9-18 months — normal)
- First words ("mama", "dada", "water")
- Points to what they want

## When to Consult the Pediatrician

Talk to your pediatrician if baby does **not** show by:
- 2 months: doesn't focus gaze
- 3 months: no social smile
- 4 months: doesn't hold head up
- 6 months: doesn't sit with support, doesn't vocalize
- 9 months: doesn't interact, doesn't imitate
- 12 months: doesn't point, doesn't say any words

## How to Support Baby During Leaps

- **More holding and physical contact** — won't "spoil"
- **Predictable routine** — helps create security
- **Appropriate stimulation** — not excessive
- **Patience** — the phase passes, usually in 1-2 weeks

---
**Source:** American Academy of Pediatrics (AAP) and infant development research.`,
  },
  {
    slug: "newborn-bath-guide",
    title: "Newborn Bath: Safe Step-by-Step Guide",
    excerpt: "When to give the first bath, correct water temperature, umbilical cord care, and newborn skin tips.",
    readTime: "6 min read",
    metaTitle: "Newborn Bath Guide: Safe Step-by-Step | Wilbor",
    metaDescription: "Complete newborn bath guide. When to start, correct temperature, umbilical cord care, and safety tips.",
    keywords: ["newborn bath", "baby first bath", "how to bathe newborn", "umbilical cord care", "newborn skin care"],
    content: `## The First Bath: When and How

The **WHO and AAP** recommend waiting at least **24 hours** after birth for the first bath. This preserves the vernix caseosa (white substance that protects baby's skin) and prevents hypothermia.

## Bath Frequency

- **Newborn (0-4 weeks):** 2-3 times per week is sufficient
- **From 1 month:** can be daily if family prefers
- **Essential daily hygiene:** clean face, neck, armpits, and diaper area

## Preparation Before the Bath

### Necessary Materials
- Baby bathtub (or basin)
- Water thermometer (or elbow to test)
- Soft, warmed towel
- Neutral soap and shampoo (pH 5.5, fragrance-free)
- Clean diaper and clothes ready
- Cotton for umbilical cord hygiene (if not yet fallen)

### Ideal Temperature
- **Water:** 98-100°F / 37-38°C (warm, not hot — test with elbow)
- **Room:** 75-79°F / 24-26°C (close windows, no draft)

## Step-by-Step Bath

1. **Prepare everything** before picking up baby
2. Undress baby and wrap in towel
3. Wash **face first** with damp cotton (no soap)
4. Wash **hair** with baby still in towel (football hold position)
5. Place baby in tub with **one hand always supporting the head**
6. Wash from **neck downward**, leaving genital area for last
7. **Remove quickly** and wrap in warmed towel
8. Dry all folds well (neck, armpits, groin, toes)

## Special Care

### Umbilical Cord Stump
- Keep dry and exposed to air
- Don't cover with diaper
- Falls naturally in 7-21 days
- Warning sign: redness, discharge with bad smell, bleeding

### Newborn Skin
- **Peeling** in the first days is normal
- **Erythema toxicum** (red spots with white center) is normal and passes
- **Milia** (white dots on nose) is normal and passes
- Don't use talcum powder (inhalation risk)
- Moisturizer: only if recommended by pediatrician

### Genital Hygiene
**Girls:** always clean front to back, never the opposite.
**Boys:** don't force the foreskin back — this is normal until ages 3-4.

## Bath Safety

- **Never leave baby alone**, not even for a second
- Empty the tub immediately after bath
- Always hold firmly — wet babies are slippery
- If the phone rings, ignore it or take baby with you

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "when-do-babies-start-sleeping-through-the-night",
    title: "When Do Babies Start Sleeping Through the Night?",
    excerpt: "Most babies begin sleeping longer stretches between 3-6 months. Learn about sleep milestones, regressions, and AAP-backed tips.",
    readTime: "5 min read",
    metaTitle: "When Do Babies Sleep Through the Night? | Wilbor Assist",
    metaDescription: "Wondering when your baby will sleep through the night? Learn about sleep milestones, regressions, and AAP-backed tips to help your newborn sleep better.",
    keywords: ["baby sleep", "sleeping through the night", "newborn sleep schedule", "infant sleep regression"],
    content: `For many new parents, a full night's sleep feels like a distant dream. According to the **American Academy of Pediatrics (AAP)**, "sleeping through the night" for a baby means sleeping a continuous stretch of 6 to 8 hours.

Most babies begin to sleep for longer stretches between **3 and 6 months** of age. By 6 months, about two-thirds of babies are able to sleep through the night regularly. However, every baby is unique — feeding methods, growth spurts, and individual temperament all play significant roles.

## Tips to Encourage Better Sleep

- Establish a **consistent bedtime routine**: warm bath, gentle massage, or reading a book
- Put your baby to bed **drowsy but awake** to help them learn to self-soothe
- Keep the room **dark and cool** (18–20°C)
- Use **white noise** to mask household sounds

For personalized, AAP-based guidance tailored to your baby's age, Wilbor Assist is here 24/7.

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-growth-spurts-signs-and-what-to-do",
    title: "Baby Growth Spurts: Signs and What to Do",
    excerpt: "Recognize the signs of baby growth spurts and learn how to respond to your baby's changing needs with patience.",
    readTime: "4 min read",
    metaTitle: "Baby Growth Spurts: Signs, Symptoms & Tips | Wilbor Assist",
    metaDescription: "Discover the common signs of baby growth spurts, when they happen, and how to soothe your fussy baby during these crucial developmental leaps.",
    keywords: ["baby growth spurts", "fussy baby", "infant development", "baby feeding schedule"],
    content: `Growth spurts are periods of rapid physical development that every baby experiences during their first year. These phases can disrupt established routines, but recognizing the signs helps you respond with patience.

## Common Signs of a Growth Spurt

- **Increased hunger** — feeding more frequently than usual
- **Sleep disruptions** — waking more often at night
- **Extra fussiness** — crying more than normal
- **Clinginess** — wanting to be held constantly

## When Do Growth Spurts Happen?

Typically at: **7–10 days**, **2–3 weeks**, **4–6 weeks**, **3 months**, **6 months**, and **9 months**.

## What to Do

Follow your baby's lead. Offer extra feedings when they show hunger cues, and provide plenty of comfort and cuddles. Growth spurts usually last **2–3 days**. For more personalized advice, consult Wilbor Assist anytime.

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "newborn-jaundice-causes-and-treatment",
    title: "Newborn Jaundice: Causes and Treatment",
    excerpt: "Learn about newborn jaundice, its causes, symptoms, and when to seek medical treatment based on AAP guidelines.",
    readTime: "5 min read",
    metaTitle: "Newborn Jaundice: Causes, Symptoms & Treatment | Wilbor Assist",
    metaDescription: "Learn about newborn jaundice, its causes, symptoms, and when to seek medical treatment. Get AAP-backed information on managing infant jaundice.",
    keywords: ["newborn jaundice", "infant jaundice treatment", "bilirubin levels", "yellow skin baby"],
    content: `Newborn jaundice is a **common condition** characterized by a yellowing of a baby's skin and the whites of their eyes. It occurs when there is an excess of **bilirubin** in the baby's blood.

## Why Does It Happen?

Because a newborn's liver is still developing, it may not process bilirubin quickly enough. Most cases are **mild and resolve on their own** within 1–2 weeks as the baby's liver matures.

## When to See a Doctor

Seek medical attention if:
- Jaundice **spreads or deepens** in color
- Baby becomes **unusually lethargic** or difficult to wake
- Jaundice appears in the **first 24 hours** of life

## Treatment

In cases where bilirubin levels are high, doctors may recommend **phototherapy** — placing the baby under special blue lights that help break down bilirubin. Severe cases are rare.

**Frequent feeding** (breast milk or formula) helps the baby pass bilirubin through their stool.

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-teething-symptoms-and-relief",
    title: "Baby Teething: Symptoms and Relief",
    excerpt: "Is your baby teething? Learn the common symptoms and discover safe, effective ways to provide relief for sore gums.",
    readTime: "4 min read",
    metaTitle: "Baby Teething: Symptoms & Safe Relief Methods | Wilbor Assist",
    metaDescription: "Is your baby teething? Learn the common symptoms of teething and discover safe, effective ways to provide relief for your little one's sore gums.",
    keywords: ["baby teething", "teething symptoms", "teething relief", "sore gums baby"],
    content: `Teething is a major milestone in a baby's first year. Most babies get their **first tooth around 6 months**, though timing varies widely.

## Common Signs of Teething

- **Excessive drooling**
- **Chewing on solid objects**
- **Irritability** and fussiness
- **Swollen, tender gums**
- Slight increase in body temperature (not a true fever)

> A true fever (over **38°C / 100.4°F**) is NOT caused by teething and should be evaluated by a doctor.

## Safe Relief Methods

- **Chilled teething ring** (not frozen) to chew on
- **Cold, wet washcloth** for gum massage
- **Gentle finger massage** on the gums
- Consult your pediatrician about **acetaminophen** if needed

⚠️ **Avoid** teething gels containing **benzocaine** — they can pose serious health risks.

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "postpartum-anxiety-vs-depression-key-differences",
    title: "Postpartum Anxiety vs Depression: Key Differences",
    excerpt: "Learn the key differences between postpartum anxiety and postpartum depression, and when to seek professional help.",
    readTime: "6 min read",
    metaTitle: "Postpartum Anxiety vs Depression: Understanding the Differences",
    metaDescription: "Learn the key differences between postpartum anxiety and postpartum depression. Discover symptoms, coping strategies, and when to seek professional help.",
    keywords: ["postpartum anxiety", "postpartum depression", "PPA vs PPD", "maternal mental health"],
    content: `The postpartum period is a time of immense physical and emotional change. While many are familiar with the "baby blues," more severe mood disorders like **Postpartum Depression (PPD)** and **Postpartum Anxiety (PPA)** are common but often misunderstood.

## Key Differences

| | Postpartum Depression (PPD) | Postpartum Anxiety (PPA) |
|---|---|---|
| **Main feeling** | Persistent sadness, hopelessness | Excessive worry, fear |
| **Thoughts** | Negative, empty | Racing, catastrophic |
| **Physical symptoms** | Fatigue, appetite changes | Rapid heartbeat, dizziness |
| **Bonding** | Difficulty bonding with baby | Overprotective of baby |

## Important: Both Are Treatable

PPD and PPA can often co-occur. Both conditions are **highly treatable** with professional help — therapy, medication, or support groups.

Experiencing these feelings does **not** make you a bad parent. It is a medical condition that requires care. If you or someone you know is struggling, reaching out to a healthcare provider is the first step.

---
**Source:** American Academy of Pediatrics (AAP), WHO.`,
  },
  {
    slug: "why-wilbor-never-prescribes-medication",
    title: "Why Wilbor Never Prescribes Medication (And Why That's Your Greatest Safety)",
    metaTitle: "Why Wilbor Doesn't Prescribe Medication | Wilbor-Assist",
    metaDescription: "Understand how Wilbor's 6-block safety protocol works and why an ethical AI should never calculate doses or prescribe medication for babies.",
    readTime: "5 min",
    excerpt: "Discover how Wilbor uses a 6-block clinical protocol to guide mothers on medications with total safety, without ever replacing the pediatrician.",
    keywords: ["AI prescription", "baby safety", "medical protocol", "baby medication", "Wilbor safety"],
    content: `## The Fine Line Between Help and Risk\n\nWhen a baby cries in the middle of the night with a fever, any mother's first instinct is to seek quick relief. In the age of artificial intelligence, it's tempting to ask a chat: *"How many drops of paracetamol do I give my 8kg baby?"*\n\nMany generic AIs would answer this question with a mathematical calculation. **Wilbor does not.** And there is a very serious reason for this.\n\n## Wilbor's 6-Block Protocol\n\nWilbor was trained with a non-negotiable guideline: **your baby's safety is above any technological convenience.**\n\nWhen you ask about medications, Wilbor activates a rigorous 6-step clinical protocol:\n\n1. **Empathy:** It understands your distress and validates your concern.\n2. **Neutral Information:** Explains what the mentioned medication is for, without encouraging its use.\n3. **Dosage Education:** Explains that the dose depends on weight and concentration, but **never does the calculation**.\n4. **Safe Guidance:** Reminds the importance of confirming the dose with the pediatrician.\n5. **Clinical Triage:** Asks essential questions (How long? What is the temperature? Are there other symptoms?).\n6. **Warning Signs:** Indicates exactly when the situation ceases to be home care and becomes an emergency room emergency.\n\n## Why Is This Your Greatest Safety?\n\nA milligram calculation error can cause severe intoxication in a baby. An AI cannot see the exact concentration of the bottle you have at home, nor evaluate the child's general condition.\n\nWilbor acts as your **smartest and safest support network**. It organizes information, calms your heart, tells you what to observe, and when to rush to the hospital. It empowers you with knowledge, but never crosses the line of medical responsibility.\n\nBecause truly caring means knowing exactly how far to go.\n\n---\n**Source:** Digital Health Safety Protocols and American Academy of Pediatrics (AAP) Guidelines.`,
  },
];

export const blogArticlesES: BlogArticleTranslation[] = [
  {
    slug: "bebe-no-duerme",
    title: "Bebé No Duerme: Guía Completa por Edad (0 a 12 Meses)",
    excerpt: "Entiende las ventanas de sueño, rutinas y técnicas basadas en la OMS para ayudar a tu bebé a dormir mejor.",
    readTime: "8 min de lectura",
    metaTitle: "Bebé No Duerme: Guía Completa por Edad | Wilbor",
    metaDescription: "Guía de sueño del bebé basada en protocolos OMS/AAP. Aprende ventanas de sueño, rutinas y técnicas para 0-12 meses.",
    keywords: ["sueño del bebé", "bebé no duerme", "rutina de sueño bebé", "regresión del sueño", "bebé recién nacido sueño"],
    content: `## ¿Por qué mi bebé no duerme?

El sueño del bebé es una de las mayores preocupaciones de las madres en todo el mundo. Según la **Organización Mundial de la Salud (OMS)**, los patrones de sueño varían significativamente según la edad, y entender estas fases es el primer paso hacia noches más tranquilas.

## Ventanas de sueño por edad

Una **ventana de sueño** es el tiempo máximo que tu bebé puede permanecer despierto antes de irritarse y tener dificultad para dormir. Respetar esta ventana es fundamental.

| Edad | Ventana de sueño | Sueño total/día | Siestas |
|------|------------------|-----------------|---------|
| 0-1 mes | 45-60 min | 16-18h | 4-6 |
| 1-2 meses | 60-90 min | 15-17h | 4-5 |
| 3-4 meses | 75-120 min | 14-16h | 3-4 |
| 5-6 meses | 2-2,5h | 14-15h | 2-3 |
| 7-9 meses | 2,5-3h | 13-14h | 2 |
| 10-12 meses | 3-4h | 12-14h | 1-2 |

## Señales de sueño

Observa las señales que indican que tu bebé está listo para dormir: frotarse los ojos, bostezar, mirada fija y tirarse de la oreja son señales iniciales. Las señales tardías incluyen llanto, irritabilidad, movimientos bruscos y arqueamiento de la espalda.

## Técnicas para mejorar el sueño

### Ambiente ideal
Mantén una temperatura entre 22°C y 24°C, usa cortinas opacas para la oscuridad, incorpora ruido blanco de un ventilador o aplicación, y coloca siempre al bebé boca arriba, siguiendo las recomendaciones de la OMS/AAP.

### Rutina de sueño (a partir de 2-3 meses)
Comienza con un baño tibio, seguido de un masaje suave, alimentación en ambiente tranquilo y oscuro, una canción de cuna o ruido blanco, y finalmente coloca al bebé en la cuna somnoliento pero despierto.

### Regresión del sueño (4 meses)
Alrededor de los 4 meses, muchos bebés experimentan una **regresión del sueño**. Es temporal (1-3 semanas) y parte del desarrollo normal.

## Cuándo consultar al pediatra

- El bebé ronca o tiene pausas en la respiración
- No duerme más de 30 minutos seguidos después de los 4 meses
- Irritabilidad extrema que no mejora con ninguna técnica
- Pérdida de peso o rechazo alimentario asociado

---
**Fuente:** Protocolos de la OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "colico-del-bebe",
    title: "Cólico del Bebé: Qué Hacer para Aliviar (Guía Práctica)",
    excerpt: "Técnicas probadas para aliviar el cólico del recién nacido. Masajes, posiciones y qué dice la OMS sobre el llanto infantil.",
    readTime: "7 min de lectura",
    metaTitle: "Cólico del Bebé: Técnicas para Aliviar | Wilbor",
    metaDescription: "Guía práctica para aliviar el cólico del bebé. Masajes, posiciones y cuándo llamar al médico.",
    keywords: ["cólico del bebé", "bebé con cólico", "aliviar cólico bebé", "llanto bebé", "gases bebé"],
    content: `## ¿Qué es el cólico del bebé?

El cólico infantil afecta aproximadamente al **20-25% de los bebés** y se caracteriza por llanto intenso e inconsolable, generalmente al final de la tarde o por la noche, en bebés sanos y bien alimentados.

Según la **Regla de Wessel** (adoptada por la OMS y AAP), se considera cólico cuando el bebé llora más de **3 horas al día**, más de **3 días a la semana**, durante más de **3 semanas consecutivas**.

## Técnicas para aliviar el cólico

### Masaje abdominal (I-L-U)
Realiza movimientos suaves en la barriga del bebé con el dedo:
1. **I** — movimiento vertical hacia abajo en el lado derecho
2. **L** — movimiento horizontal de derecha a izquierda, luego baja
3. **U** — movimiento en U, subiendo por el lado izquierdo

### Posición de avión
Acuesta al bebé boca abajo en tu antebrazo, con la barriga apoyada y la cabeza en el pliegue del codo. La leve presión en la barriga ayuda a eliminar gases.

### Calor en la barriga
Coloca un pañal tibio (no caliente) doblado sobre la barriga del bebé mientras lo sostienes.

### Movimiento y ruido blanco
- Camina con el bebé en brazos o en el cochecito
- Sonidos de "shhhh" cerca del oído del bebé
- Vibración suave (paseo en coche)

## Qué NO hacer
- ❌ No des infusiones de hierbas — sin evidencia y riesgo de contaminación
- ❌ No des medicamentos sin prescripción médica
- ❌ No sacudas al bebé — riesgo de síndrome del bebé sacudido

## Cuándo consultar al pediatra
- Llanto asociado a fiebre (por encima de 38°C)
- El bebé rechaza la alimentación
- Pérdida de peso
- Sangre en las heces
- Vómitos frecuentes e intensos

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "fiebre-en-bebe",
    title: "Fiebre en el Bebé: Cuándo Ir al Hospital (Guía por Edad)",
    excerpt: "Aprende cuándo la fiebre es una emergencia, cómo medir correctamente y las pautas de la OMS para tratar la fiebre en casa.",
    readTime: "6 min de lectura",
    metaTitle: "Fiebre en el Bebé: Cuándo Ir al Hospital | Wilbor",
    metaDescription: "Guía de fiebre en bebés por edad. Cuándo ir a urgencias, cómo tratar en casa y señales de alarma.",
    keywords: ["fiebre bebé", "temperatura bebé", "bebé con fiebre", "fiebre recién nacido", "cuándo ir al hospital bebé"],
    content: `## ¿Cuándo es la fiebre una emergencia?

La fiebre es un mecanismo de defensa del organismo, no una enfermedad. Sin embargo, en bebés pequeños puede indicar infecciones graves que necesitan atención inmediata.

## Definición de fiebre por método de medición

| Método | Temperatura normal | Fiebre |
|--------|-------------------|--------|
| Rectal (más preciso) | hasta 37,5°C | ≥ 38°C |
| Axilar | hasta 36,5°C | ≥ 37,5°C |
| Oral | hasta 37°C | ≥ 37,8°C |
| Timpánico (oído) | hasta 37,5°C | ≥ 38°C |

## Fiebre por edad: cuándo ir a urgencias

### Recién nacido (0-28 días)
**Cualquier fiebre por encima de 38°C = emergencia.** Ve a urgencias inmediatamente. No esperes.

### 1-3 meses
Fiebre por encima de **38°C** = consulta médica en pocas horas.

### 3-6 meses
- Fiebre por encima de **39°C** = consulta médica
- Fiebre con otros síntomas = emergencia

### 6-12 meses
- Fiebre por encima de **39,5°C** que no cede con medicamento
- Fiebre que dura más de **3 días**

## Señales de alarma (ve a urgencias inmediatamente)
- Manchas moradas o rojas que no desaparecen al presionar
- Dificultad para respirar
- Llanto inconsolable por más de 2 horas
- Bebé muy somnoliento, difícil de despertar
- Cuello rígido
- Convulsión

## Cómo tratar la fiebre en casa

### Medicamentos
- **Paracetamol:** 10-15mg/kg cada 4-6 horas. Puede darse a partir de los 3 meses.
- **Ibuprofeno:** 5-10mg/kg cada 6-8 horas. Solo a partir de los 6 meses.
- **Nunca des aspirina** a niños — riesgo de síndrome de Reye.

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "introduccion-alimentaria",
    title: "Introducción Alimentaria: Guía Completa para Empezar (BLW y Tradicional)",
    excerpt: "Cuándo empezar, BLW vs método tradicional, primeros alimentos seguros e introducción de alérgenos según la OMS.",
    readTime: "10 min de lectura",
    metaTitle: "Introducción Alimentaria: Guía Completa | Wilbor",
    metaDescription: "Guía completa para iniciar la alimentación complementaria a los 6 meses. BLW vs tradicional, primeros alimentos y alérgenos.",
    keywords: ["introducción alimentaria", "alimentación complementaria", "BLW bebé", "primeros alimentos bebé", "baby led weaning"],
    content: `## ¿Cuándo empezar?

La **Organización Mundial de la Salud (OMS)** y la **AAP** recomiendan iniciar la alimentación complementaria a los **6 meses completos**, manteniendo la lactancia materna hasta los 2 años o más.

### Señales de preparación (todas deben estar presentes):
- Sostiene la cabeza sin apoyo
- Se sienta con apoyo mínimo
- Muestra interés por la comida de los adultos
- Perdió el reflejo de extrusión

## BLW vs. Método Tradicional

| Aspecto | BLW (Baby-Led Weaning) | Método Tradicional |
|---------|------------------------|-------------------|
| Textura inicial | Trozos de alimentos blandos | Papillas y purés |
| Control | El bebé controla cuánto come | Los padres dan con cuchara |
| Autonomía | Alta desde el inicio | Gradual |
| Recomendación OMS | Aceptado | Aceptado |

## Alimentos por fase

### 6 meses — Primeros alimentos
- Verduras cocidas blandas: zanahoria, papa, calabacín
- Frutas blandas: plátano, mango, pera cocida, aguacate
- Proteínas: pollo desmenuzado, carne molida, huevo bien cocido
- Cereales: arroz, pasta, avena

## Alimentos prohibidos antes de 1 año

| Alimento | Motivo |
|----------|--------|
| Miel | Riesgo de botulismo infantil |
| Leche de vaca como bebida principal | Proteína difícil de digerir |
| Sal | Riñones inmaduros |
| Azúcar | Malos hábitos alimentarios |

## ¡Alérgenos: introduce temprano!

La introducción temprana de alérgenos **reduce** el riesgo de alergia. Introduce individualmente, con intervalo de 3 días: huevo, maní (pasta), leche de vaca, trigo, pescado, soja.

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "depresion-posparto",
    title: "Depresión Posparto: Señales, Cuándo Buscar Ayuda y Qué Hacer",
    excerpt: "La depresión posparto afecta al 10-20% de las madres. Aprende las señales, factores de riesgo y dónde encontrar ayuda.",
    readTime: "8 min de lectura",
    metaTitle: "Depresión Posparto: Señales y Ayuda | Wilbor",
    metaDescription: "Guía completa sobre depresión posparto. Señales, factores de riesgo, tratamiento y dónde encontrar ayuda.",
    keywords: ["depresión posparto", "baby blues", "síntomas depresión posparto", "ansiedad posparto", "depresión nueva mamá"],
    content: `## No estás sola

La **depresión posparto (DPP)** afecta entre el **10% y el 20% de las madres** en todo el mundo, según la OMS. Es una condición médica real, no una debilidad de carácter.

## Baby Blues vs. Depresión Posparto

| Característica | Baby Blues | Depresión Posparto |
|----------------|------------|-------------------|
| Inicio | 2-3 días después del parto | 2-8 semanas después del parto |
| Duración | Hasta 2 semanas | Meses sin tratamiento |
| Intensidad | Leve a moderada | Moderada a grave |
| Tratamiento | Apoyo y descanso | Profesional necesario |

## Señales de la depresión posparto

- Tristeza persistente, llanto frecuente sin motivo aparente
- Sentimiento de culpa o inadecuación como madre
- Pensamientos de que el bebé estaría mejor sin ti
- Ansiedad intensa, ataques de pánico
- Dificultad para conectar con el bebé
- Aislamiento social

## Dónde buscar ayuda
- **Línea de crisis local** — consulta los recursos de tu país
- **Médico de familia o ginecólogo** — primer punto de contacto
- **Grupos de apoyo para madres** — compartir experiencias ayuda mucho

## Tratamiento

- **Psicoterapia** (terapia cognitivo-conductual es la más estudiada)
- **Medicación** (existen antidepresivos seguros para la lactancia)
- **Grupos de apoyo**
- **Ejercicio físico** (caminatas ligeras ya hacen diferencia)

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "vacunas-del-bebe",
    title: "Vacunas del Bebé: Calendario Completo y Reacciones Esperadas",
    excerpt: "Calendario de vacunación OMS/PAHO para 0-12 meses, reacciones esperadas y cuándo llamar al médico.",
    readTime: "7 min de lectura",
    metaTitle: "Vacunas del Bebé: Calendario Completo | Wilbor",
    metaDescription: "Calendario de vacunación para bebés 0-12 meses según OMS. Reacciones esperadas y cuándo buscar atención médica.",
    keywords: ["vacunas bebé", "calendario vacunación bebé", "vacunas recién nacido", "reacciones vacunas bebé", "esquema vacunación infantil"],
    content: `## Calendario de vacunación del bebé (0-12 meses)

El calendario de vacunación recomendado por la **OMS/PAHO** proporciona la mejor protección para tu bebé.

## Vacunas por edad

| Edad | Vacuna | Protege contra |
|------|--------|----------------|
| Al nacer | HepB (1ª dosis) | Hepatitis B |
| 2 meses | DTaP (1ª dosis) | Difteria, tétanos, tos ferina |
| 2 meses | IPV (1ª dosis) | Poliomielitis |
| 2 meses | Hib (1ª dosis) | Haemophilus influenzae tipo b |
| 2 meses | Neumocócica (1ª dosis) | Neumonía, meningitis |
| 2 meses | Rotavirus (1ª dosis) | Diarrea por rotavirus |
| 6 meses | Influenza (anual) | Gripe |
| 12 meses | Triple Viral (1ª dosis) | Sarampión, paperas, rubéola |
| 12 meses | Varicela (1ª dosis) | Varicela |

## Reacciones esperadas (normales)

- **Fiebre leve** (hasta 38,5°C) en las primeras 24-48 horas
- **Enrojecimiento e hinchazón** en el lugar de la inyección
- **Irritabilidad** y llanto más frecuente
- **Somnolencia** o cambios en el apetito

## Cuándo consultar al pediatra después de la vacuna
- Fiebre por encima de **39,5°C** o que dura más de 48 horas
- **Llanto inconsolable** por más de 3 horas
- **Convulsión**
- **Hinchazón extensa** en el miembro vacunado

---
**Fuente:** OMS, PAHO y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "lactancia-agarre-correcto",
    title: "Lactancia Materna: Agarre Correcto, Posiciones y Dificultades Comunes",
    excerpt: "Domina el agarre correcto, las mejores posiciones para amamantar y soluciones a problemas como la mastitis y el bajo suministro.",
    readTime: "9 min de lectura",
    metaTitle: "Guía de Lactancia: Agarre y Posiciones | Wilbor",
    metaDescription: "Guía completa de lactancia materna: agarre correcto, posiciones, ingurgitación, mastitis y bajo suministro de leche.",
    keywords: ["lactancia materna", "agarre correcto lactancia", "posiciones lactancia", "mastitis", "poca leche materna"],
    content: `## La importancia de la lactancia materna

La **leche materna** es el alimento ideal para el bebé en los primeros 6 meses de vida. La OMS y la AAP recomiendan:
- **Lactancia exclusiva** hasta los 6 meses
- **Lactancia complementada** hasta los 2 años o más

## El agarre correcto

Un agarre incorrecto es la principal causa de dolor en la lactancia y baja producción de leche.

### Señales de agarre correcto ✓
- Boca bien abierta (ángulo de 120° o más)
- Labio inferior hacia afuera
- Mentón tocando el pecho
- Más areola visible arriba que abajo de la boca
- Mejillas redondeadas (no hundidas)
- Escuchas deglución, no chasquidos

### Señales de agarre incorrecto ✗
- Dolor intenso durante toda la toma
- Pezón aplastado o con marcas al salir
- El bebé hace ruidos de chasquido
- Mejillas hundidas

## Posiciones para amamantar

### Posición de cuna (clásica)
Bebé acostado en tu brazo, barriga con barriga. Buena para bebés más grandes.

### Posición de balón de fútbol americano
Bebé a tu lado, bajo el brazo, con las piernas hacia atrás. Excelente para:
- Post-cesárea
- Bebés prematuros
- Pechos grandes

### Posición acostada
Madre y bebé acostados de lado, frente a frente. Ideal para tomas nocturnas.

## Dificultades comunes

### Ingurgitación (pecho duro)
- **Alivio:** amamanta con frecuencia, compresa tibia antes, compresa fría después

### Grietas en el pezón
- Verifica el agarre — es la causa más común
- Aplica leche materna en el pezón después de la toma

### Mastitis
- Continúa amamantando (no perjudica al bebé)
- Compresa tibia y masaje suave
- Consulta al médico — puede necesitar antibióticos

---
**Fuente:** OMS, AAP y UNICEF.`,
  },
  {
    slug: "seguridad-bebe-hogar",
    title: "Seguridad del Bebé en Casa: Prevención de Accidentes por Edad",
    excerpt: "Lista de verificación de seguridad por habitación, prevención por tipo de accidente y qué hacer en emergencias.",
    readTime: "8 min de lectura",
    metaTitle: "Seguridad del Bebé en Casa: Lista Completa | Wilbor",
    metaDescription: "Guía completa de seguridad del bebé por habitación y edad. Previene caídas, asfixia, intoxicación y ahogamiento.",
    keywords: ["seguridad bebé", "prevención accidentes bebé", "babyproof hogar", "seguridad infantil", "accidentes domésticos bebé"],
    content: `## Accidentes domésticos: la principal causa de muerte evitable

Los accidentes domésticos son la **principal causa de muerte evitable** en niños menores de 5 años. La buena noticia: la mayoría son 100% prevenibles.

## Lista de verificación por habitación

### Habitación del bebé ✓
- [ ] Cuna con barrotes firmes (máximo 6cm entre barrotes)
- [ ] Colchón firme, sin almohada, sin cojines, sin peluches en la cuna
- [ ] El bebé siempre duerme boca arriba
- [ ] Temperatura de la habitación entre 20-22°C
- [ ] Monitor de bebé instalado
- [ ] Protectores de enchufes
- [ ] Cortinas sin cordones (riesgo de estrangulamiento)

### Cocina ✓
- [ ] Seguros en cajones y armarios bajos
- [ ] Mangos de las ollas siempre hacia adentro
- [ ] Productos de limpieza en armario alto con seguro

### Baño ✓
- [ ] Nunca dejes al bebé solo en la bañera (ni un segundo)
- [ ] Alfombra antideslizante en la bañera y en el suelo
- [ ] Temperatura del agua: 37-38°C (prueba con el codo)
- [ ] Medicamentos en armario alto con seguro

## Prevención por tipo de accidente

### Caídas (más común entre 6-12 meses)
- Nunca dejes al bebé en superficie elevada sin supervisión
- Instala portones en las escaleras antes de que el bebé gatee

### Atragantamiento
Alimentos de riesgo: uva entera, cereza, maní entero, zanahoria cruda, manzana cruda en trozos grandes.
- Corta siempre en trozos pequeños
- Aprende la maniobra de Heimlich para bebés

### Intoxicación
- Los medicamentos son la principal causa
- Guarda TODO en un lugar alto y con seguro
- **Centro de Control de Intoxicaciones:** consulta el número de tu país

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "saltos-desarrollo-bebe",
    title: "Saltos de Desarrollo del Bebé: Qué Esperar Mes a Mes",
    excerpt: "Entiende los hitos del desarrollo, las semanas maravilla y cómo apoyar a tu bebé en cada salto.",
    readTime: "9 min de lectura",
    metaTitle: "Saltos de Desarrollo del Bebé: Guía Mes a Mes | Wilbor",
    metaDescription: "Guía completa de hitos del desarrollo del bebé y semanas maravilla. Qué esperar de 1 a 12 meses.",
    keywords: ["saltos de desarrollo bebé", "semanas maravilla", "hitos bebé", "desarrollo infantil", "crisis de crecimiento bebé"],
    content: `## ¿Qué son los saltos de desarrollo?

Los **saltos de desarrollo** (también llamados crisis de crecimiento o semanas maravilla) son períodos en los que el bebé pasa por cambios neurológicos intensos. Durante estos períodos, es común:
- Llanto excesivo e irritabilidad
- Regresión del sueño
- Mayor demanda de brazos y atención
- Rechazo temporal de la alimentación

## Hitos del desarrollo por mes

### 1 mes
- Enfoca la mirada en rostros (especialmente a 20-30cm)
- Reacciona a sonidos fuertes
- Movimientos reflejos (succión, prensión)

### 2 meses
- **Primera sonrisa social** (¡no son gases!)
- Comienza a vocalizar ("ah", "oh")
- Sigue objetos con los ojos

### 3 meses
- Sostiene la cabeza por más tiempo
- Sonríe en respuesta a la sonrisa del adulto

### 4 meses
- **Regresión del sueño** (hito neurológico importante)
- Ríe en voz alta
- Intenta alcanzar objetos

### 6 meses
- Se sienta con apoyo
- Transfiere objetos de una mano a la otra
- Reconoce su propio nombre

### 9-10 meses
- Se pone de pie con apoyo
- Pinza (agarra objetos pequeños con pulgar e índice)
- Entiende "no" y "adiós"

### 11-12 meses
- Primeros pasos (puede variar de 9 a 18 meses — normal)
- Primeras palabras ("mamá", "papá")
- Señala lo que quiere

## Cuándo consultar al pediatra

Habla con el pediatra si el bebé **no** muestra hasta:
- 3 meses: no sonríe socialmente
- 6 meses: no se sienta con apoyo, no vocaliza
- 12 meses: no señala, no dice ninguna palabra

---
**Fuente:** OMS, AAP e investigaciones sobre desarrollo infantil.`,
  },
  {
    slug: "bano-recien-nacido",
    title: "Baño del Recién Nacido: Guía Segura Paso a Paso",
    excerpt: "Cuándo dar el primer baño, temperatura correcta del agua, cuidado del cordón umbilical y consejos para la piel del recién nacido.",
    readTime: "6 min de lectura",
    metaTitle: "Baño del Recién Nacido: Guía Segura | Wilbor",
    metaDescription: "Guía completa del baño del recién nacido. Cuándo empezar, temperatura correcta, cuidado del cordón umbilical y seguridad.",
    keywords: ["baño recién nacido", "primer baño bebé", "cómo bañar recién nacido", "cuidado cordón umbilical", "piel recién nacido"],
    content: `## El primer baño: cuándo y cómo

La **OMS y la AAP** recomiendan esperar al menos **24 horas** después del nacimiento para el primer baño. Esto preserva el vérnix caseoso y evita la hipotermia.

## Frecuencia del baño

- **Recién nacido (0-4 semanas):** 2-3 veces por semana es suficiente
- **A partir de 1 mes:** puede ser diario si la familia lo prefiere
- **Higiene diaria esencial:** limpiar cara, cuello, axilas y zona del pañal

## Preparación antes del baño

### Materiales necesarios
- Bañera para bebé (o palangana)
- Termómetro de agua (o codo para probar)
- Toalla suave y caliente
- Jabón y champú neutros (pH 5,5, sin fragancia)
- Pañal y ropa limpia listos

### Temperatura ideal
- **Agua:** 37-38°C (tibia, no caliente — prueba con el codo)
- **Ambiente:** 24-26°C (cierra ventanas, sin corriente de aire)

## Paso a paso del baño

1. **Prepara todo** antes de coger al bebé
2. Desviste al bebé y envuélvelo en la toalla
3. Lava la **cara primero** con algodón húmedo (sin jabón)
4. Lava el **cabello** con el bebé aún en la toalla
5. Coloca al bebé en la bañera con **una mano siempre apoyando la cabeza**
6. Lava del **cuello hacia abajo**, dejando la zona genital para el final
7. **Retira rápidamente** y envuelve en la toalla caliente
8. Seca bien todos los pliegues (cuello, axilas, ingle, dedos)

## Cuidados especiales

### Cordón umbilical
- Mantén seco y expuesto al aire
- No cubras con el pañal
- Cae naturalmente en 7-21 días
- Señal de alarma: enrojecimiento, secreción con mal olor, sangrado

### Piel del recién nacido
- La **descamación** en los primeros días es normal
- El **eritema tóxico** (manchas rojas con centro blanco) es normal
- No uses talco (riesgo de inhalación)

## Seguridad en el baño

- **Nunca dejes al bebé solo**, ni un segundo
- Vacía la bañera inmediatamente después del baño
- Sujeta siempre con firmeza — los bebés mojados resbalan

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "cuando-empiezan-los-bebes-a-dormir-toda-la-noche",
    title: "\u00bfCu\u00e1ndo Empiezan los Beb\u00e9s a Dormir Toda la Noche?",
    excerpt: "La mayor\u00eda de los beb\u00e9s comienza a dormir tramos m\u00e1s largos entre los 3 y 6 meses. Conoce los hitos del sue\u00f1o y consejos basados en la AAP.",
    readTime: "5 min de lectura",
    metaTitle: "\u00bfCu\u00e1ndo Duermen los Beb\u00e9s Toda la Noche? | Wilbor Assist",
    metaDescription: "Descubre cu\u00e1ndo tu beb\u00e9 empezar\u00e1 a dormir toda la noche. Conoce los hitos del sue\u00f1o, las regresiones y consejos basados en la AAP.",
    keywords: ["sue\u00f1o del beb\u00e9", "dormir toda la noche", "horario de sue\u00f1o del reci\u00e9n nacido", "regresi\u00f3n del sue\u00f1o"],
    content: `Para muchos padres primerizos, una noche completa de sue\u00f1o parece un sue\u00f1o lejano. Seg\u00fan la **AAP**, \"dormir toda la noche\" para un beb\u00e9 significa dormir un tramo continuo de 6 a 8 horas.

La mayor\u00eda de los beb\u00e9s comienza a dormir por per\u00edodos m\u00e1s largos entre los **3 y 6 meses** de edad. A los 6 meses, aproximadamente dos tercios de los beb\u00e9s pueden dormir toda la noche regularmente.

## Consejos para Fomentar Mejores H\u00e1bitos de Sue\u00f1o

- Establece una **rutina constante** a la hora de acostarse: ba\u00f1o tibio, masaje suave o leer un libro
- Acuesta a tu beb\u00e9 **somnoliento pero despierto** para que aprenda a calmarse solo
- Mant\u00e9n la habitaci\u00f3n **oscura y fresca** (18\u201320\u00b0C)
- Usa **ruido blanco** para enmascarar los sonidos del hogar

Si tienes dificultades, Wilbor Assist est\u00e1 aqu\u00ed 24/7 para brindarte orientaci\u00f3n personalizada.

---
**Fuente:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "denticion-del-bebe-sintomas-y-alivio",
    title: "Dentici\u00f3n del Beb\u00e9: S\u00edntomas y Alivio",
    excerpt: "\u00bfA tu beb\u00e9 le est\u00e1n saliendo los dientes? Conoce los s\u00edntomas y descubre formas seguras de aliviar sus enc\u00edas doloridas.",
    readTime: "4 min de lectura",
    metaTitle: "Dentici\u00f3n del Beb\u00e9: S\u00edntomas y M\u00e9todos Seguros de Alivio | Wilbor Assist",
    metaDescription: "\u00bfA tu beb\u00e9 le est\u00e1n saliendo los dientes? Conoce los s\u00edntomas comunes de la dentici\u00f3n y descubre formas seguras y efectivas de aliviar sus enc\u00edas doloridas.",
    keywords: ["dentici\u00f3n del beb\u00e9", "s\u00edntomas de dentici\u00f3n", "alivio de dentici\u00f3n", "enc\u00edas doloridas beb\u00e9"],
    content: `La dentici\u00f3n es un hito importante en el primer a\u00f1o de un beb\u00e9. A la mayor\u00eda les sale su **primer diente alrededor de los 6 meses**, aunque el momento puede variar.

## Signos Comunes de Dentici\u00f3n

- **Babeo excesivo**
- **Masticar objetos s\u00f3lidos**
- **Irritabilidad** y mal humor
- **Enc\u00edas hinchadas y sensibles**

> Una fiebre real (m\u00e1s de **38\u00b0C**) NO es causada por la dentici\u00f3n y debe ser evaluada por un m\u00e9dico.

## M\u00e9todos Seguros de Alivio

- **Mordedor fr\u00edo** (no congelado) para masticar
- **Toallita h\u00fameda y fr\u00eda** para masaje de enc\u00edas
- **Masaje suave con el dedo** en las enc\u00edas

\u26a0\ufe0f **Evita** los geles para la dentici\u00f3n que contengan **benzoca\u00edna**.

---
**Fuente:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "ictericia-neonatal-causas-y-tratamiento",
    title: "Ictericia Neonatal: Causas y Tratamiento",
    excerpt: "Aprende sobre la ictericia neonatal, sus causas, s\u00edntomas y cu\u00e1ndo buscar tratamiento m\u00e9dico seg\u00fan la AAP.",
    readTime: "5 min de lectura",
    metaTitle: "Ictericia Neonatal: Causas, S\u00edntomas y Tratamiento | Wilbor Assist",
    metaDescription: "Aprende sobre la ictericia neonatal, sus causas, s\u00edntomas y cu\u00e1ndo buscar tratamiento m\u00e9dico. Obtén informaci\u00f3n respaldada por la AAP.",
    keywords: ["ictericia neonatal", "tratamiento ictericia infantil", "niveles de bilirrubina", "beb\u00e9 piel amarilla"],
    content: `La ictericia neonatal es una **afección com\u00fan** caracterizada por el color amarillento de la piel y los ojos del beb\u00e9. Ocurre cuando hay un exceso de **bilirrubina** en la sangre.

## \u00bfPor Qu\u00e9 Ocurre?

Debido a que el h\u00edgado del reci\u00e9n nacido a\u00fan se est\u00e1 desarrollando, puede no procesar la bilirrubina lo suficientemente r\u00e1pido. La mayor\u00eda de los casos son **leves y se resuelven solos** en 1\u20132 semanas.

## Cu\u00e1ndo Consultar al M\u00e9dico

- La ictericia **se extiende o se oscurece**
- El beb\u00e9 se vuelve **inusualmente let\u00e1rgico**
- La ictericia aparece en las **primeras 24 horas** de vida

## Tratamiento

En casos con niveles altos de bilirrubina, los m\u00e9dicos pueden recomendar **fototerapia**. La **alimentaci\u00f3n frecuente** ayuda al beb\u00e9 a eliminar la bilirrubina.

---
**Fuente:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "ansiedad-posparto-sintomas-y-diferencias-con-depresion",
    title: "Ansiedad Posparto vs Depresi\u00f3n: Diferencias Clave",
    excerpt: "Conoce las diferencias clave entre la ansiedad posparto y la depresi\u00f3n posparto, y cu\u00e1ndo buscar ayuda profesional.",
    readTime: "6 min de lectura",
    metaTitle: "Ansiedad Posparto vs Depresi\u00f3n: Entendiendo las Diferencias",
    metaDescription: "Conoce las diferencias clave entre la ansiedad posparto y la depresi\u00f3n posparto. Descubre los s\u00edntomas y cu\u00e1ndo buscar ayuda profesional.",
    keywords: ["ansiedad posparto", "depresi\u00f3n posparto", "APP vs DPP", "salud mental materna"],
    content: `El per\u00edodo posparto es un momento de inmensos cambios f\u00edsicos y emocionales. La **Depresi\u00f3n Posparto (DPP)** y la **Ansiedad Posparto (APP)** son comunes pero a menudo incomprendidas.

## Diferencias Clave

| | Depresi\u00f3n Posparto (DPP) | Ansiedad Posparto (APP) |
|---|---|---|
| **Sentimiento principal** | Tristeza persistente, desesperanza | Preocupaci\u00f3n excesiva, miedo |
| **Pensamientos** | Negativos, vac\u00edos | Acelerados, catastr\u00f3ficos |
| **S\u00edntomas f\u00edsicos** | Fatiga, cambios de apetito | Latidos r\u00e1pidos, mareos |

## Importante: Ambas Son Tratables

La DPP y la APP pueden coexistir. Ambas son **altamente tratables** con ayuda profesional \u2014 terapia, medicaci\u00f3n o grupos de apoyo.

Experimentar estos sentimientos **no** te convierte en mala madre. Es una condici\u00f3n m\u00e9dica que requiere atenci\u00f3n.

---
**Fuente:** American Academy of Pediatrics (AAP), OMS.`,
  },
  {
    slug: "crecimiento-del-bebe-tablas-de-peso-y-talla-oms",
    title: "Crecimiento del Beb\u00e9: Tablas de Peso y Talla de la OMS",
    excerpt: "Entiende c\u00f3mo usar las tablas de crecimiento de la OMS para monitorear el peso y la talla de tu beb\u00e9.",
    readTime: "4 min de lectura",
    metaTitle: "Crecimiento del Beb\u00e9: Tablas de Peso y Talla de la OMS | Wilbor Assist",
    metaDescription: "Entiende c\u00f3mo usar las tablas de crecimiento de la OMS para monitorear el peso y la talla de tu beb\u00e9. Conoce qu\u00e9 significan los percentiles.",
    keywords: ["crecimiento del beb\u00e9", "tablas de peso beb\u00e9", "percentiles OMS", "desarrollo infantil"],
    content: `Monitorear el crecimiento de tu beb\u00e9 es fundamental en las visitas de control. Los pediatras utilizan las **tablas de crecimiento de la OMS** para hacer seguimiento del peso, longitud y circunferencia de la cabeza desde el nacimiento hasta los 2 a\u00f1os.

## \u00bfQu\u00e9 Son los Percentiles?

Cuando el m\u00e9dico mide a tu beb\u00e9, traza los n\u00fameros en la tabla para determinar su **percentil**. Estar en un percentil alto o bajo **no indica necesariamente un problema** \u2014 lo importante es un **patr\u00f3n de crecimiento constante** a lo largo del tiempo.

## Cu\u00e1ndo Preocuparse

Si la curva de crecimiento de tu beb\u00e9 **cae dr\u00e1sticamente** o cruza varios percentiles, tu pediatra puede investigar m\u00e1s a fondo.

Si tienes preguntas sobre las medidas de tu beb\u00e9, Wilbor Assist est\u00e1 disponible para ofrecerte orientaci\u00f3n basada en la OMS y la AAP.

---
**Fuente:** Organización Mundial de la Salud (OMS), American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "por-que-wilbor-nunca-receta-medicamentos",
    title: "Por qué Wilbor nunca receta medicamentos (y por qué esa es tu mayor seguridad)",
    metaTitle: "Por qué Wilbor no receta medicamentos | Wilbor-Assist",
    metaDescription: "Entiende cómo funciona el protocolo de seguridad de 6 bloques de Wilbor y por qué una IA ética nunca debe calcular dosis o recetar medicamentos para bebés.",
    readTime: "5 min",
    excerpt: "Descubre cómo Wilbor usa un protocolo clínico de 6 bloques para guiar a las madres sobre medicamentos con total seguridad, sin reemplazar nunca al pediatra.",
    keywords: ["prescripción IA", "seguridad bebé", "protocolo médico", "medicamento bebé", "Wilbor seguridad"],
    content: `## La Fina Línea Entre Ayuda y Riesgo\n\nCuando el bebé llora de madrugada con fiebre, el primer instinto de cualquier madre es buscar alivio rápido. En la era de la inteligencia artificial, es tentador preguntarle a un chat: *"¿Cuántas gotas de paracetamol le doy a mi bebé de 8kg?"*\n\nMuchas IA genéricas responderían a esta pregunta con un cálculo matemático. **Wilbor no.** Y hay una razón muy seria para esto.\n\n## El Protocolo de 6 Bloques de Wilbor\n\nWilbor fue entrenado con una directriz innegociable: **la seguridad de tu bebé está por encima de cualquier conveniencia tecnológica.**\n\nCuando preguntas sobre medicamentos, Wilbor activa un riguroso protocolo clínico de 6 etapas:\n\n1. **Acogida:** Entiende tu angustia y valida tu preocupación.\n2. **Información Neutral:** Explica para qué sirve el medicamento mencionado, sin fomentar su uso.\n3. **Educación sobre Dosis:** Explica que la dosis depende del peso y la concentración, pero **nunca hace el cálculo**.\n4. **Orientación Segura:** Recuerda la importancia de confirmar la dosis con el pediatra.\n5. **Triaje Clínico:** Hace preguntas esenciales (¿Cuánto tiempo? ¿Cuál es la temperatura? ¿Hay otros síntomas?).\n6. **Señales de Alerta:** Indica exactamente cuándo la situación deja de ser un cuidado en casa y se convierte en una emergencia de urgencias.\n\n## ¿Por Qué Esta es Tu Mayor Seguridad?\n\nUn error de cálculo de miligramos puede causar una intoxicación grave en un bebé. Una IA no puede ver la concentración exacta del frasco que tienes en casa, ni evaluar el estado general del niño.\n\nWilbor actúa como tu **red de apoyo más inteligente y segura**. Organiza la información, calma tu corazón, te dice qué observar y cuándo correr al hospital. Te empodera con conocimiento, pero nunca cruza la línea de la responsabilidad médica.\n\nPorque cuidar de verdad es saber exactamente hasta dónde llegar.\n\n---\n**Fuente:** Protocolos de Seguridad en Salud Digital y Directrices de la American Academy of Pediatrics (AAP).`,
  },
];

// ============================================
// FRENCH (FR) ARTICLES
// ============================================
export const blogArticlesFR: BlogArticleTranslation[] = [
  {
    slug: "bebe-ne-dort-pas",
    title: "Bébé ne dort pas : guide complet par âge (0 à 12 mois)",
    excerpt: "Comprenez les fenêtres de sommeil de votre bébé selon son âge et apprenez des techniques éprouvées pour améliorer les nuits.",
    readTime: "8 min de lecture",
    metaTitle: "Bébé ne dort pas : guide complet par âge (0 à 12 mois) | Wilbor",
    metaDescription: "Comprenez les fenêtres de sommeil de votre bébé selon son âge et apprenez des techniques éprouvées pour améliorer les nuits.",
    keywords: ["bébé ne dort pas", "sommeil bébé", "fenêtre de sommeil", "routine sommeil bébé"],
    content: `## Pourquoi mon bébé ne dort-il pas ?

Le sommeil du bébé est l’une des plus grandes préoccupations des mères. Selon la **Société Brésilienne de Pédiatrie (SBP)**, les rythmes de sommeil varient considérablement selon l’âge, et comprendre ces phases est la première étape vers des nuits plus sereines.

## Fenêtres de sommeil selon l’âge

La **fenêtre de sommeil** est le temps maximal pendant lequel votre bébé peut rester éveillé avant de devenir irritable et d’avoir du mal à s’endormir. Respecter cette fenêtre est essentiel.

| Âge | Fenêtre de sommeil | Sommeil total/jour | Siestes |
|-------|---------------|-------------------|---------|
| 0-1 mois | 45-60 min | 16-18h | 4-6 |
| 1-2 mois | 60-90 min | 15-17h | 4-5 |
| 3-4 mois | 75-120 min | 14-16h | 3-4 |
| 5-6 mois | 2-2,5h | 14-15h | 2-3 |
| 7-9 mois | 2,5-3h | 13-14h | 2 |
| 10-12 mois | 3-4h | 12-14h | 1-2 |

## Signes de sommeil

Soyez attentive aux signes qui indiquent que votre bébé est prêt à dormir :

- **Signes précoces :** se frotter les yeux, bâiller, regard fixe, tirer sur l’oreille
- **Signes tardifs :** pleurs, irritabilité, mouvements brusques, cambrure du dos

**Conseil important :** Lorsque vous remarquez les signes tardifs, le bébé a déjà dépassé le moment idéal. Essayez de le coucher dès les premiers signes.

## Techniques pour améliorer le sommeil

### Environnement idéal
- **Température :** entre 22°C et 24°C
- **Obscurité :** utilisez des rideaux occultants
- **Bruit blanc :** ventilateur, application de bruit blanc ou “shhhh” continu
- **Position :** toujours sur le dos (recommandation SBP/AAP)

### Routine du sommeil (à partir de 2-3 mois)
1. Bain tiède (pas chaud)
2. Massage doux avec des mouvements lents
3. Tétée dans un environnement calme et sombre
4. Berceuse ou bruit blanc
5. Mettre au lit somnolent, mais éveillé

### Régression du sommeil (4 mois)
Vers 4 mois, de nombreux bébés traversent une **régression du sommeil**. Cela se produit parce que leur rythme de sommeil est en train de mûrir. C’est temporaire (1 à 3 semaines) et cela fait partie du développement normal.

## Quand consulter le pédiatre

- Le bébé ronfle ou fait des pauses respiratoires pendant le sommeil
- Il ne dort pas plus de 30 minutes d’affilée après 4 mois
- Irritabilité extrême qui ne s’améliore avec aucune technique
- Perte de poids ou refus de s’alimenter associé

---

**Source :** Protocoles de la Société Brésilienne de Pédiatrie (SBP) et de l’American Academy of Pediatrics (AAP).

---`,
  },
  {
    slug: "coliques-bebe",
    title: "Coliques du bébé : que faire pour les soulager (guide pratique)",
    excerpt: "Techniques éprouvées pour soulager les coliques : massage Shantala, position avion, emmaillotage et plus encore.",
    readTime: "6 min de lecture",
    metaTitle: "Coliques du bébé : que faire pour les soulager (guide pratique) | Wilbor",
    metaDescription: "Techniques éprouvées pour soulager les coliques : massage Shantala, position avion, emmaillotage et plus encore.",
    keywords: ["coliques bébé", "massage Shantala", "soulager coliques", "bébé qui pleure"],
    content: `## Qu’est-ce que la colique du bébé ?

La colique est définie par la **règle des 3** : pleurs intenses pendant plus de **3 heures par jour**, plus de **3 jours par semaine**, pendant plus de **3 semaines**. Elle touche environ 20 à 25 % des bébés et commence généralement entre 2 et 3 semaines de vie.

## Quand cela survient

- **Début :** 2-3 semaines de vie
- **Pic :** 6-8 semaines
- **Fin :** généralement à 3-4 mois
- **Horaire le plus fréquent :** fin d’après-midi et début de soirée (17h-23h)

## Techniques de soulagement éprouvées

### 1. Massage Shantala (I-L-U)
La technique I-L-U est un massage abdominal qui suit le trajet de l’intestin :

1. **I** — Faites glisser la main du côté gauche du bébé, de haut en bas
2. **L** — Faites glisser de la droite vers la gauche puis vers le bas (en formant un L inversé)
3. **U** — Faites glisser de bas en haut sur le côté droit, passez au-dessus puis redescendez sur le côté gauche (en formant un U inversé)

**Quand le faire :** lorsque le bébé est calme, avant la crise. Utilisez une huile végétale sur les mains.

### 2. Position avion
Placez le bébé à plat ventre sur votre avant-bras, la tête soutenue dans votre main. La pression douce sur l’abdomen aide à soulager les gaz.

### 3. Swaddle (emmaillotage)
Enveloppez fermement le bébé dans un linge ou une couverture légère, les bras le long du corps. Cela simule l’environnement utérin et réduit le réflexe de Moro.

**Attention :** cessez d’utiliser l’emmaillotage lorsque le bébé commence à se retourner (vers 2-3 mois).

### 4. Bruit blanc + bercement
Le “shhhh” continu près de l’oreille du bébé, associé à un bercement doux, active le réflexe d’apaisement. Le son doit être aussi fort que les pleurs du bébé.

### 5. Vélo
Avec le bébé allongé sur le dos, faites des mouvements de vélo avec ses jambes. Cela aide à éliminer les gaz coincés.

## Ce qu’il NE faut PAS faire

- **Ne donnez pas de tisanes ni de médicaments** sans l’avis du pédiatre
- **Ne secouez jamais le bébé** — cela peut provoquer une grave lésion cérébrale (syndrome du bébé secoué)
- **Ne changez pas de lait infantile** sans avis médical
- **Ne culpabilisez pas** — les coliques ne sont pas causées par quelque chose que vous avez fait ou oublié de faire

## Quand consulter le pédiatre

- Fièvre au-dessus de 37,8°C
- Vomissements fréquents ou en jet
- Sang dans les selles
- Refus de s’alimenter pendant plus de 8 heures
- Bébé inconsolable pendant plus de 4 heures d’affilée

---

**Source :** Protocoles de la Société Brésilienne de Pédiatrie (SBP) et de l’American Academy of Pediatrics (AAP).

---`,
  },
  {
    slug: "fievre-bebe",
    title: "Fièvre chez le bébé : quand aller à l’hôpital (guide par âge)",
    excerpt: "Sachez quand la fièvre du bébé est une urgence, comment la mesurer correctement et quoi faire à chaque âge.",
    readTime: "5 min de lecture",
    metaTitle: "Fièvre chez le bébé : quand aller à l’hôpital (guide par âge) | Wilbor",
    metaDescription: "Sachez quand la fièvre du bébé est une urgence, comment la mesurer correctement et quoi faire à chaque âge.",
    keywords: ["fièvre bébé", "quand aller urgences bébé", "température bébé", "fièvre nourrisson"],
    content: `## Quand la fièvre est-elle une urgence ?

La fièvre est l’un des motifs les plus fréquents de consultation pédiatrique. Selon la **SBP**, la conduite à tenir dépend directement de **l’âge du bébé**.

## Classification selon la température

| Température axillaire | Classification |
|-------------------|---------------|
| Jusqu’à 37,2°C | Normale |
| 37,3°C - 37,5°C | État fébrile |
| 37,6°C - 38,9°C | Fièvre |
| 39°C - 40°C | Forte fièvre |
| Au-dessus de 40°C | Très forte fièvre (urgence) |

## Conduite à tenir selon l’âge

### 0-3 mois : TOUJOURS une urgence
Toute fièvre chez un bébé de moins de 3 mois nécessite une **évaluation médicale immédiate**. À cet âge, le système immunitaire est immature et les infections peuvent évoluer rapidement.

**Allez à l’hôpital si :** température axillaire au-dessus de 37,5°C.

### 3-6 mois : vigilance renforcée
- Fièvre au-dessus de 38,5°C → consultez le pédiatre
- Fièvre qui dure plus de 24 heures → consultez le pédiatre
- Bébé irritable, abattu ou refusant de téter → urgence

### 6-12 mois : observez l’état général
- Fièvre au-dessus de 39°C → consultez le pédiatre
- Fièvre qui dure plus de 48-72 heures → consultez le pédiatre
- Si le bébé est actif, joue et s’alimente bien, surveillez à la maison

## Comment mesurer correctement

1. Utilisez un thermomètre digital (jamais au mercure)
2. Placez-le sous l’aisselle pendant 3 à 5 minutes
3. Maintenez le bras du bébé contre son corps
4. Mesurez lorsque le bébé est calme (pas juste après une tétée ou des pleurs)

## Mesures de confort

- **Hydratation :** proposez le sein ou de l’eau fréquemment
- **Vêtements légers :** retirez l’excès de vêtements et de couvertures
- **Environnement frais :** gardez la chambre aérée
- **Bain tiède :** peut aider à faire baisser la température (jamais froid)
- **Compresses tièdes :** sous les aisselles et à l’aine (jamais d’alcool)

## Signes d’alerte (allez à l’hôpital)

- Fièvre chez un bébé de moins de 3 mois
- Température au-dessus de 40°C à tout âge
- Convulsion fébrile (tremblements, yeux révulsés)
- Taches violettes sur la peau
- Difficulté à respirer
- Abattement extrême (bébé “mou”, sans réaction)
- Fontanelle bombée
- Pleurs inconsolables pendant des heures

---

**Source :** Protocoles de la Société Brésilienne de Pédiatrie (SBP) et de l’American Academy of Pediatrics (AAP).

---`,
  },
  {
    slug: "diversification-alimentaire",
    title: "Diversification alimentaire : guide complet pour commencer (BLW et traditionnel)",
    excerpt: "Tout sur la diversification alimentaire : quand commencer, BLW vs traditionnel, aliments par âge et comment introduire les allergènes.",
    readTime: "7 min de lecture",
    metaTitle: "Diversification alimentaire : guide complet pour commencer (BLW et traditionnel) | Wilbor",
    metaDescription: "Tout sur la diversification alimentaire : quand commencer, BLW vs traditionnel, aliments par âge et comment introduire les allergènes.",
    keywords: ["diversification alimentaire", "BLW", "introduction alimentation bébé", "purée bébé"],
    content: `## Quand commencer ?

La **Société Brésilienne de Pédiatrie (SBP)** et l’**OMS** recommandent l’allaitement maternel exclusif jusqu’à **6 mois révolus**. La diversification alimentaire doit commencer à 6 mois, lorsque le bébé présente des signes de préparation.

## Signes de préparation

- Peut s’asseoir avec un soutien minimal
- Tient sa tête fermement
- A perdu le réflexe de protrusion de la langue (ne pousse plus la nourriture hors de la bouche)
- Montre de l’intérêt pour la nourriture des adultes
- Peut attraper des objets et les porter à la bouche

## Méthodes : BLW vs Traditionnelle vs Mixte

### BLW (Baby-Led Weaning)
Le bébé mange seul, avec les mains, en utilisant des aliments coupés de façon appropriée.

**Avantages :** autonomie, développement moteur, acceptation des textures.  
**Précautions :** découpe sécurisée (bâtonnets de la taille d’un doigt), surveillance constante.

### Traditionnelle (purée)
Aliments écrasés à la fourchette (non mixés) proposés à la cuillère.

**Avantages :** contrôle de la quantité, moins de désordre.  
**Précautions :** faire évoluer les textures progressivement, ne pas utiliser de mixeur.

### Mixte (recommandée par la SBP)
Combine les deux méthodes selon le repas et le moment.

## Aliments selon l’âge

| Âge | Aliments | Texture |
|-------|-----------|---------|
| 6 mois | Fruits, légumes, tubercules | Écrasé ou grands bâtonnets |
| 7 mois | + Haricots, lentilles, céréales | Écrasé avec de petits morceaux |
| 8 mois | + Œuf entier, poisson, pois chiches | Haché finement |
| 9 mois | + Pâtes, couscous | Morceaux plus grands |
| 10-12 mois | Repas de la famille | Adapté (sans sel/sucre) |

## Allergènes : quand et comment les introduire

La SBP recommande **d’introduire les allergènes tôt** (à partir de 6 mois), car cela peut **réduire** le risque d’allergie :

1. **Œuf :** commencez par le jaune cuit, puis le blanc
2. **Arachide :** pâte diluée dans une purée (jamais entière — risque d’étouffement)
3. **Lait de vache :** dans des préparations (pas comme boisson principale avant 1 an)
4. **Blé :** pain, pâtes
5. **Poisson :** commencez par des poissons blancs

**Règle :** introduisez 1 nouvel allergène tous les 3 jours et observez les réactions (plaques, gonflement, vomissements).

## Ce qu’il ne faut JAMAIS donner avant 1 an

- **Miel** (risque de botulisme)
- **Sel et sucre** (inutiles et nocifs)
- **Lait de vache comme boisson** (à remplacer par le lait maternel ou une formule)
- **Aliments ronds entiers** (raisin, tomate cerise — coupez-les en deux)
- **Aliments durs et petits** (arachides entières, popcorn)

---

**Source :** Protocoles de la SBP, de l’OMS et de l’AAP.

---`,
  },
  {
    slug: "vaccins-bebe",
    title: "Vaccins du bébé : calendrier complet et ce à quoi s’attendre",
    excerpt: "Calendrier complet des vaccins de la première année, effets secondaires normaux et comment soulager l’inconfort.",
    readTime: "5 min de lecture",
    metaTitle: "Vaccins du bébé : calendrier complet et ce à quoi s’attendre | Wilbor",
    metaDescription: "Calendrier complet des vaccins de la première année, effets secondaires normaux et comment soulager l’inconfort.",
    keywords: ["vaccins bébé", "calendrier vaccinal", "vaccinations nourrisson"],
    content: `## Pourquoi vacciner ?

Les vaccins sont l’intervention de santé publique la plus efficace de l’histoire. Selon l’**OMS**, les vaccins évitent 2 à 3 millions de décès par an dans le monde. Pour les bébés, l’immunisation pendant les premiers mois est particulièrement critique, car le système immunitaire est encore immature.

## Calendrier de la première année

| Âge | Vaccins |
|-------|---------|
| À la naissance | BCG, Hépatite B |
| 2 mois | Penta (DTP+Hib+HepB), VPI (Polio), Pneumo 10, Rotavirus |
| 3 mois | Méningocoque C |
| 4 mois | Penta, VPI, Pneumo 10, Rotavirus |
| 5 mois | Méningocoque C |
| 6 mois | Penta, VPI, Influenza |
| 9 mois | Fièvre jaune |
| 12 mois | ROR, Pneumo 10 (rappel), Méningocoque C (rappel) |

## Effets secondaires normaux

### Locaux (au site d’injection)
- Rougeur, gonflement, induration
- Douleur au toucher
- Durée : 1 à 3 jours

### Systémiques (généraux)
- Fièvre légère (jusqu’à 38,5°C) — surtout après la Penta
- Irritabilité, pleurs
- Somnolence ou agitation
- Durée : 24 à 48 heures

### Comment soulager
- **Antipyrétique :** paracétamol ou ibuprofène (selon l’avis du pédiatre)
- **Compresses froides** au site d’injection
- **Allaitement** — confort et analgésie naturelle
- **Bras et câlins** — le bébé a besoin de sécurité

## Mythes sur les vaccins

**“Le vaccin cause l’autisme”** — FAUX. L’étude d’origine était frauduleuse et a été retirée. Aucune étude sérieuse ne confirme ce lien.

**“Le vaccin surcharge le système immunitaire”** — FAUX. Le bébé est exposé chaque jour à des milliers d’antigènes. Les vaccins n’en représentent qu’une infime fraction.

**“Il vaut mieux attraper la maladie naturellement”** — FAUX. Des maladies comme la rougeole, la coqueluche et la méningite peuvent provoquer de graves séquelles ou la mort.

## Quand NE PAS vacciner (véritables contre-indications)

- Forte fièvre le jour du vaccin (au-dessus de 38,5°C)
- Réaction anaphylactique à la dose précédente
- Immunodéficience sévère (pour les vaccins vivants)

**Un léger rhume N’EST PAS une contre-indication** — la vaccination peut avoir lieu normalement.

## Conseils pour le jour du vaccin

1. Apportez le carnet de vaccination
2. Allaitez avant et après (analgésie naturelle)
3. Apportez un jouet préféré pour distraire
4. Ne promettez pas que “ça ne fera pas mal” — soyez honnête
5. Tenez le bébé dans vos bras pendant l’injection

---

**Source :** Calendrier National de Vaccination (Ministère de la Santé), SBP et OMS.

---`,
  },
  {
    slug: "allaitement-guide-complet",
    title: "Allaitement : guide complet pour les premiers mois",
    excerpt: "Bonne prise du sein, production de lait, douleurs fréquentes et comment surmonter les défis de l’allaitement.",
    readTime: "7 min de lecture",
    metaTitle: "Allaitement : guide complet pour les premiers mois | Wilbor",
    metaDescription: "Bonne prise du sein, production de lait, douleurs fréquentes et comment surmonter les défis de l’allaitement.",
    keywords: ["allaitement", "prise du sein", "allaitement maternel", "latch bébé"],
    content: `## Pourquoi allaiter ?

Le lait maternel est l’aliment le plus complet pour le bébé pendant les premiers mois de vie. L’**OMS** et la **SBP** recommandent :
- **Allaitement exclusif** jusqu’à 6 mois
- **Allaitement complémentaire** (avec d’autres aliments) jusqu’à 2 ans ou plus

## Bienfaits du lait maternel

### Pour le bébé
- Protection contre les infections (anticorps maternels)
- Réduction des allergies, de l’asthme et du diabète
- Développement cérébral et visuel
- Réduction du risque de mort subite
- Protection contre l’obésité à l’âge adulte

### Pour la mère
- Réduction du risque de cancer du sein et de l’ovaire
- Récupération utérine plus rapide
- Renforcement du lien affectif
- Économie financière

## La bonne prise du sein

La prise du sein est le facteur le plus important pour réussir l’allaitement.

### Signes d’une bonne prise
- Bouche bien ouverte (plus de 120°)
- Lèvre inférieure tournée vers l’extérieur
- Menton en contact avec le sein
- Aréole plus visible au-dessus qu’en dessous
- Joues arrondies (pas creusées)
- Vous ne ressentez pas de douleur (une pression est possible, mais pas une douleur)

### Positions d’allaitement
1. **Berceau** — bébé dans les bras, ventre contre ventre
2. **Ballon de rugby** — bébé sous le bras, idéale après une césarienne
3. **Allongée sur le côté** — pratique la nuit
4. **Koala** — bébé assis sur la cuisse

## Production de lait : comment cela fonctionne

Le lait est produit **à la demande** : plus le bébé tète, plus le lait est produit. Pendant les premiers jours, le **colostrum** (premier lait jaunâtre) est suffisant — il n’est pas nécessaire de compléter.

### Signes que le lait est suffisant
- Le bébé a au moins **6 couches mouillées** par jour
- Il prend du poids correctement (à vérifier en consultation)
- Il tète fréquemment (8 à 12 fois/jour au début) et semble rassasié

## Douleurs et problèmes fréquents

### Crevasses du mamelon
**Cause :** mauvaise prise du sein.  
**Solution :** corriger la prise. Appliquez du lait maternel sur le mamelon après la tétée (cicatrisant naturel).

### Engorgement mammaire
**Cause :** accumulation de lait.  
**Solution :** compresse tiède avant la tétée, compresse froide après. Vider le sein fréquemment.

### Mastite
**Cause :** infection bactérienne.  
**Symptômes :** fièvre, rougeur, douleur intense.  
**Solution :** continuez à allaiter (cela n’aggrave pas l’infection), consultez le médecin pour un antibiotique.

## Conseils pour augmenter la production

- **Allaitez fréquemment** — 8 à 12 fois/jour au début
- **Proposez les deux seins** à chaque tétée
- **Reposez-vous** quand le bébé dort
- **Évitez les compléments** inutiles (le biberon réduit la stimulation)
- **Tirez votre lait** entre les tétées pour stimuler

### Bébé qui refuse le sein
- Essayez dans un environnement calme et sombre
- Proposez quand le bébé est somnolent
- Peau à peau (bébé seulement en couche dans les bras de la mère)
- Vérifiez s’il y a un frein de langue court

## Quand demander de l’aide

- Douleur qui ne s’améliore pas après correction de la prise
- Crevasses qui saignent ou ne cicatrisent pas
- Fièvre + rougeur du sein (mastite possible)
- Bébé ne prend pas de poids correctement
- Bébé n’a pas au moins 6 couches mouillées par jour

---

**Source :** Société Brésilienne de Pédiatrie (SBP), OMS et Cahier de Soins Primaires n° 23 (Ministère de la Santé).

---`,
  },
  {
    slug: "developpement-moteur-bebe",
    title: "Développement moteur du bébé : étapes clés et comment le stimuler",
    excerpt: "Étapes du développement moteur mois par mois et activités pour stimuler chaque phase.",
    readTime: "6 min de lecture",
    metaTitle: "Développement moteur du bébé : étapes clés et comment le stimuler | Wilbor",
    metaDescription: "Étapes du développement moteur mois par mois et activités pour stimuler chaque phase.",
    keywords: ["développement moteur bébé", "étapes développement", "bébé rampe marche"],
    content: `## Pourquoi le développement moteur est-il important ?

Le développement moteur est l’un des principaux indicateurs de la santé neurologique du bébé. Selon la **SBP**, suivre les étapes motrices permet d’identifier précocement les signes de retard, qui peuvent être pris en charge avec beaucoup plus d’efficacité lorsqu’ils sont détectés tôt.

## Étapes motrices mois par mois

| Âge | Étape attendue | Signe d’alerte |
|-------|---------------|-----------------|
| 1 mois | Soulève brièvement la tête sur le ventre | Ne réagit pas aux sons |
| 2 mois | Tient sa tête quelques secondes | Ne fixe pas le regard |
| 3 mois | Tient sa tête fermement | Ne sourit pas |
| 4 mois | Se retourne du ventre au dos | N’attrape pas les objets |
| 5 mois | S’assoit avec soutien | Ne transfère pas les objets |
| 6 mois | S’assoit sans soutien (certains) | Ne s’assoit pas avec soutien |
| 7 mois | Rampe ou commence à se déplacer | Ne se met pas debout avec appui |
| 8 mois | Se met debout avec appui | Ne rampe pas |
| 9 mois | Marche avec appui | N’utilise pas la pince |
| 10 mois | Premiers pas (certains) | Ne montre pas du doigt |
| 11 mois | Marche avec appui stable | N’imite pas les gestes |
| 12 mois | Marche seul (la majorité) | Ne dit aucun mot |

## Activités de stimulation selon la phase

### 0-3 mois : stimulation sensorielle
- **Tummy time** (temps sur le ventre) : 3 à 5 minutes, 3 fois par jour — renforce le cou et les épaules
- **Contraste visuel :** montrez des objets noirs et blancs (la vision est encore en développement)
- **Mobile :** suspendu à 20-30 cm du visage
- **Contact peau à peau :** stimule le système nerveux et le lien affectif

### 4-6 mois : coordination et préhension
- **Proposez des jouets** à attraper (hochet, anneau en caoutchouc)
- **Miroir :** les bébés adorent se regarder
- **Rouler :** aidez le bébé à se retourner en plaçant un jouet à côté
- **S’asseoir avec soutien :** utilisez des coussins ou vos bras

### 7-9 mois : mobilité et exploration
- **Espace sécurisé au sol** pour ramper
- **Obstacles doux** (coussins) à franchir
- **Jouets qui roulent** à poursuivre
- **Boîtes et pots** à ouvrir et fermer (coordination)

### 10-12 mois : premiers pas
- **Chariot de marche à pousser** (pas le trotteur avec siège — interdit par la SBP)
- **Surfaces variées :** tapis, herbe, sable (stimule la proprioception)
- **Marches basses** avec surveillance
- **Jeux debout** appuyé au canapé

## Quand consulter le pédiatre

- Ne tient pas sa tête à 4 mois
- Ne s’assoit pas sans soutien à 9 mois
- Ne marche pas à 18 mois
- A perdu des compétences qu’il avait déjà acquises
- Asymétrie des mouvements (utilise davantage un côté du corps)
- Hypertonie ou hypotonie (très raide ou très “mou”)

---

**Source :** Société Brésilienne de Pédiatrie (SBP) et Denver Developmental Screening Test.

---`,
  },
  {
    slug: "securite-bebe-maison",
    title: "Sécurité du bébé à la maison : prévention des accidents selon l’âge",
    excerpt: "Prévention des accidents domestiques selon l’âge : chutes, étouffements, brûlures et plus encore.",
    readTime: "6 min de lecture",
    metaTitle: "Sécurité du bébé à la maison : prévention des accidents selon l’âge | Wilbor",
    metaDescription: "Prévention des accidents domestiques selon l’âge : chutes, étouffements, brûlures et plus encore.",
    keywords: ["sécurité bébé", "accidents domestiques", "prévention chutes bébé"],
    content: `## Accidents domestiques : la principale cause de décès évitable

Selon la **SBP**, les accidents domestiques sont la **principale cause de décès chez les enfants de 1 à 14 ans**. La plupart sont **évitables** grâce à des mesures de sécurité simples.

## Risques selon l’âge

### 0-3 mois : chutes et suffocation
- **Ne laissez jamais le bébé seul** sur des surfaces en hauteur (table à langer, lit, canapé)
- **Sommeil sécurisé :** toujours sur le dos, sans oreillers, couvertures lâches ni peluches dans le lit
- **N’utilisez pas de tours de lit** (risque de suffocation)
- **Attention aux cordons** de rideaux, tétines et vêtements près du cou

### 4-6 mois : chutes et petits objets
- Le bébé commence à se retourner — **ne le laissez jamais seul** sur des surfaces non protégées
- **Tout va à la bouche** — retirez les petits objets à sa portée (pièces, boutons, bouchons)
- **Chaise haute** avec harnais de sécurité
- **N’utilisez pas de trotteur** (interdit par la SBP — risque de chutes graves)

### 7-9 mois : ramper = tout explorer
- **Installez des barrières** en haut et en bas des escaliers
- **Protégez les prises électriques** avec des cache-prises
- **Verrouillez les placards** contenant des produits ménagers, des médicaments et des objets tranchants
- **Protégez les angles** des tables et des meubles
- **Fixez les meubles lourds** au mur (bibliothèques, commodes, téléviseurs)

### 10-12 mois : premiers pas = plus de chutes
- **Tapis antidérapants** dans la salle de bain et la cuisine
- **Portes sécurisées** pour la cuisine et la salle de bain
- **Poignées de casseroles** tournées vers l’intérieur sur la cuisinière
- **Fils électriques** hors de portée
- **Fenêtres avec filet** ou limiteur d’ouverture

## Étouffement : que faire

### Bébé de moins d’1 an (manœuvre de Heimlich adaptée)
1. Placez le bébé **à plat ventre sur votre avant-bras**, la tête plus basse que le corps
2. Donnez **5 tapes fermes** dans le dos, entre les omoplates
3. Si cela ne fonctionne pas, **retournez-le sur le dos** et faites **5 compressions** au centre de la poitrine (2 doigts)
4. **Répétez** jusqu’à ce que l’objet sorte ou que le bébé tousse/pleure
5. S’il perd connaissance, **appelez les services d’urgence** et commencez la RCP

### Prévention de l’étouffement
- Coupez les aliments en petits morceaux adaptés à l’âge
- **Aliments dangereux :** raisin entier, popcorn, arachides, saucisse en rondelles, bonbons durs
- Surveillez **tous** les repas
- Ne donnez pas de nourriture dans une voiture en mouvement

## Brûlures : prévention

- **Testez la température de l’eau** du bain (idéal : 37°C) — utilisez le coude
- **Ne tenez pas le bébé** pendant que vous buvez des liquides chauds
- **Cuisinez sur les brûleurs arrière** de la cuisinière
- **Fer à repasser :** rangez-le encore chaud dans un endroit élevé et inaccessible
- **Crème solaire :** seulement à partir de 6 mois

## Noyade : vigilance maximale

- **Ne laissez jamais le bébé seul** dans la baignoire, la piscine ou près d’un seau — pas même 1 seconde
- Les bébés peuvent se noyer dans **moins de 5 cm d’eau**
- **Videz les seaux et les bassines** après usage
- **Piscines :** clôture d’environ 1,5 m avec portail et verrou

## Kit de premiers secours

Ayez à la maison :
- Thermomètre digital
- Sérum physiologique
- Gaze stérile
- Sparadrap micropore
- Ciseaux à bouts ronds
- Antipyrétique prescrit par le pédiatre
- Numéro des services d’urgence et du pédiatre bien visibles

---

**Source :** Société Brésilienne de Pédiatrie (SBP) et Ministère de la Santé — Programme de Prévention des Accidents de l’Enfance.

---`,
  },
  {
    slug: "pics-developpement-bebe",
    title: "Pics de développement du bébé : à quoi s’attendre mois par mois",
    excerpt: "Quand surviennent les pics de développement, les signes de chaque phase et comment gérer l’irritabilité du bébé.",
    readTime: "7 min de lecture",
    metaTitle: "Pics de développement du bébé : à quoi s’attendre mois par mois | Wilbor",
    metaDescription: "Quand surviennent les pics de développement, les signes de chaque phase et comment gérer l’irritabilité du bébé.",
    keywords: ["pics de développement", "sauts développement bébé", "bébé irritable"],
    content: `## Que sont les pics de développement ?

Les **pics de développement** sont des périodes pendant lesquelles le cerveau du bébé traverse une **réorganisation neurologique intense**. Durant ces périodes, le bébé acquiert de nouvelles compétences — mais ce processus peut le rendre irritable, pleurnichard et très demandeur.

## Calendrier des pics (0-12 mois)

| Semaine | Âge approx. | Ce qui change | Durée |
|--------|-------------|------------|----------|
| Semaine 5 | 1 mois | Sensations (vue, audition plus aiguisées) | 1-2 semaines |
| Semaine 8 | 2 mois | Schémas (reconnaît les visages, les mains) | 1-2 semaines |
| Semaine 12 | 3 mois | Transitions douces (mouvements plus coordonnés) | 1-2 semaines |
| Semaine 19 | 4,5 mois | Événements (comprend la cause et l’effet) | 1-5 semaines |
| Semaine 26 | 6 mois | Relations (distance, dedans/dehors) | 1-5 semaines |
| Semaine 37 | 8,5 mois | Catégories (regroupe les objets par ressemblance) | 3-6 semaines |
| Semaine 46 | 10,5 mois | Séquences (comprend l’ordre des choses) | 3-6 semaines |
| Semaine 55 | 12,5 mois | Programmes (teste des stratégies, résout des problèmes) | 3-6 semaines |

## Signes que le bébé traverse un pic

- **Plus de pleurs et d’irritabilité** que d’habitude
- **Plus collant** — veut être dans les bras tout le temps
- **Changement dans le sommeil** — se réveille plus, dort moins
- **Changement dans l’appétit** — tète davantage ou refuse
- **Anxiété de séparation** — pleure quand vous sortez de son champ de vision

## Étapes du développement mois par mois

### 1 mois
- Fixe brièvement le regard
- Réagit aux sons forts
- Soulève brièvement la tête lorsqu’il est sur le ventre

### 2 mois
- Premier sourire social
- Suit les objets des yeux
- Émet des sons (“ahhh”, “ohhh”)

### 3 mois
- Tient sa tête
- Rit aux éclats
- Ouvre et ferme les mains
- Découvre ses propres mains

### 4 mois
- Se retourne du ventre au dos (ou inversement)
- Attrape des objets avec les deux mains
- Reconnaît les visages familiers

### 5-6 mois
- S’assoit avec soutien
- Passe les objets d’une main à l’autre
- Babille des syllabes (“ba-ba”, “ma-ma”)
- Commence à montrer une préférence pour certaines personnes

### 7-8 mois
- S’assoit sans soutien
- Rampe (ou se traîne)
- Anxiété de séparation (pleure avec les inconnus)
- Tape des mains, fait au revoir

### 9-10 mois
- Se met debout avec appui
- Pince fine (attrape les petits objets avec le pouce et l’index)
- Comprend “non”
- Pointe ce qu’il veut

### 11-12 mois
- Premiers pas (avec ou sans appui)
- Premiers mots ayant un sens (“maman”, “papa”)
- Imite les gestes et les sons
- Joue à cache-cache

## Comment aider pendant les pics

1. **Plus de bras et de peau à peau** — le bébé a besoin de sécurité
2. **Allaitez plus souvent** — confort + nutrition
3. **Maintenez la routine** — la prévisibilité apaise
4. **Proposez des stimulations adaptées** — nouveaux jouets, textures, sons
5. **Soyez patiente** — le pic est temporaire (1 à 6 semaines)
6. **Ne comparez pas** — chaque bébé a son propre rythme

## Quand s’inquiéter

Consultez le pédiatre si le bébé :
- Ne tient pas sa tête à 4 mois
- Ne s’assoit pas sans soutien à 9 mois
- N’établit pas de contact visuel
- Ne réagit pas aux sons
- A perdu des compétences qu’il avait déjà acquises (régression)

---

**Source :** Société Brésilienne de Pédiatrie (SBP), "The Wonder Weeks" (Van de Rijt & Plooij) et AAP.

---`,
  },
  {
    slug: "bain-nouveau-ne",
    title: "Bain du nouveau-né : étape par étape sûre et complète",
    excerpt: "Guide complet, étape par étape, pour donner le bain au nouveau-né avec sécurité et confiance.",
    readTime: "6 min de lecture",
    metaTitle: "Bain du nouveau-né : étape par étape sûre et complète | Wilbor",
    metaDescription: "Guide complet, étape par étape, pour donner le bain au nouveau-né avec sécurité et confiance.",
    keywords: ["bain nouveau-né", "premier bain bébé", "soins cordon ombilical"],
    content: `## Le premier bain : quand et comment

Le premier bain du nouveau-né génère souvent beaucoup d’anxiété. La **SBP** recommande que le premier bain soit donné **après la stabilisation du bébé**, généralement au cours des premières 24 heures de vie.

## Préparation : tout prêt AVANT de commencer

Avant de déshabiller le bébé, laissez tout à portée de main :

- **Baignoire** avec de l’eau tiède (36-37°C)
- **Serviette** douce avec capuche
- **Couche** propre
- **Vêtements** propres
- **Savon** liquide doux (spécifique pour bébé)
- **Coton** ou gaze pour le visage
- **Thermomètre de bain** (facultatif, mais recommandé)

**Règle d’or :** ne laissez JAMAIS le bébé seul dans la baignoire, pas même 1 seconde.

## Étape par étape du bain

### 1. Température de l’eau
- **Idéale :** 36°C à 37°C
- **Comment tester :** plongez le coude — l’eau doit être tiède et confortable
- **Niveau d’eau :** suffisant pour couvrir les épaules du bébé lorsqu’il est assis

### 2. Environnement
- **Température de la pièce :** entre 22°C et 26°C
- **Sans courants d’air** — fermez fenêtres et portes
- **Moment :** de préférence avant la tétée (pas juste après)

### 3. Sécurité pour tenir le bébé
- Soutenez la tête et le cou du bébé sur votre avant-bras
- Tenez-le fermement sous l’aisselle avec votre main
- L’autre main reste libre pour le laver
- **Ne le lâchez jamais** — les bébés glissent quand ils sont mouillés

### 4. Ordre de lavage
1. **Visage** — avec du coton ou un linge humide (sans savon)
2. **Tête** — avec peu de savon, massez doucement
3. **Corps** — cou, bras, mains, tronc
4. **Plis** — cou, aisselles, aine (où la saleté s’accumule)
5. **Parties génitales** — en dernier (filles : toujours de l’avant vers l’arrière)
6. **Dos** — retournez le bébé avec précaution

### 5. Durée
- **5 à 10 minutes** suffisent
- Les bains longs refroidissent l’eau et dessèchent la peau

### 6. Après le bain
- Enveloppez-le immédiatement dans la serviette
- Séchez bien les **plis** (cou, aisselles, aine, derrière les oreilles)
- Séchez le **cordon ombilical** avec une gaze propre
- Habillez-le rapidement pour qu’il ne se refroidisse pas

## Soins du cordon ombilical

- **Nettoyage :** séchez avec une gaze propre après le bain et à chaque changement de couche
- **N’utilisez pas :** alcool à 70 %, mercure, pommades ou bandages
- **Couche :** repliez-la vers le bas pour laisser le cordon à l’air libre
- **Chute :** entre 7 et 21 jours (un peu de sang peut apparaître — c’est normal)
- **Consultez le pédiatre si :** rougeur autour, sécrétion à forte odeur, gonflement

## Produits recommandés

- **Savon :** liquide, doux, sans parfum fort (pH 5,5)
- **Shampooing :** seulement à partir de 2-3 mois (avant cela, utilisez le savon)
- **Hydratant :** uniquement si la peau est sèche, avec l’avis du pédiatre
- **Évitez :** talc, eau de Cologne, lingettes avec alcool

## Bain ofuro (seau)

Le bain ofuro reproduit l’environnement de l’utérus et peut apaiser les bébés agités :

- Utilisez un seau spécifique pour bébé
- Eau à la même température (36-37°C)
- Le bébé reste immergé jusqu’aux épaules, en position fœtale
- Excellent pour les bébés qui ont des coliques
- **Toujours sous surveillance** — tenez le bébé en permanence

## Conseils supplémentaires

- **Le bain du soir** peut aider à instaurer la routine du sommeil
- **Le massage après le bain** détend et renforce le lien
- **Fréquence :** 1 fois par jour suffit (l’excès dessèche la peau)
- **Température :** ne devinez jamais — testez toujours avec le coude

---

**Source :** Société Brésilienne de Pédiatrie (SBP).

---`,
  },
  {
    slug: "algorithme-predit-sommeil-bebe",
    title: "L’algorithme qui prédit quand votre bébé va dormir (et pourquoi cela change tout)",
    excerpt: "Découvrez comment Wilbor utilise l’intelligence artificielle pour prédire avec précision la prochaine sieste de votre bébé, en combinant des données réelles avec des protocoles médicaux.",
    readTime: "5 min de lecture",
    metaTitle: "L’algorithme qui prédit quand votre bébé va dormir (et pourquoi cela change tout) | Wilbor",
    metaDescription: "Découvrez comment Wilbor utilise l’intelligence artificielle pour prédire avec précision la prochaine sieste de votre bébé, en combinant des données réelle",
    keywords: ["Wilbor sommeil", "prédiction sieste bébé", "IA bébé sommeil"],
    content: `## L’algorithme qui prédit quand votre bébé va dormir

Imaginez savoir, avec précision, que votre bébé aura besoin de dormir à 14h37. Non pas par intuition — mais par la science. C’est l’une des fonctions les plus exclusives de Wilbor : la **Prévision Intelligente des Siestes**.

## Comment cela fonctionne

Wilbor croise deux sources de données en temps réel :

### 1. Tableau médical des fenêtres d’éveil
Basé sur l’âge exact du bébé en semaines :
- **0–6 semaines :** le bébé ne supporte que 45 à 60 min éveillé
- **3–4 mois :** la fenêtre d’éveil augmente à 75 à 90 min
- **6 mois :** il supporte déjà 2 à 2,5 heures entre les siestes

### 2. Historique réel de votre bébé
Wilbor enregistre chaque sieste que vous renseignez. Avec le temps, il apprend les schémas uniques de votre enfant.

## La formule

Le système combine les deux sources :

**Prévision = (60% × données réelles du bébé) + (40% × référence médicale selon l’âge)**

Plus vous enregistrez de données, plus la prévision devient personnalisée et précise.

## Pourquoi cela change tout

Avant, les mères essayaient de deviner l’heure de la sieste — et se trompaient. Avec la prévision intelligente :
- **Moins de pleurs** — vous agissez avant l’épuisement extrême
- **Routine plus prévisible** — vous planifiez votre journée en toute sécurité
- **Sommeil plus profond** — le bébé dort dans la bonne fenêtre, pas après

---
**Basé sur :** Protocole des fenêtres d’éveil de l’AAP et données sur le sommeil néonatal de la SBP.

---`,
  },
  {
    slug: "ia-lit-entre-les-lignes",
    title: "L’IA qui lit entre les lignes : comment Wilbor comprend ce que vous n’avez pas dit",
    excerpt: "Wilbor dispose d’un système d’analyse émotionnelle qui identifie l’épuisement, l’anxiété et les signes de surcharge dans les messages des mères — même lorsqu’elles ne demandent pas directement de l’aide.",
    readTime: "5 min de lecture",
    metaTitle: "L’IA qui lit entre les lignes : comment Wilbor comprend ce que vous n’avez pas dit | Wilbor",
    metaDescription: "Wilbor dispose d’un système d’analyse émotionnelle qui identifie l’épuisement, l’anxiété et les signes de surcharge dans les messages des mères — même lors",
    keywords: ["Wilbor IA", "épuisement maternel", "soutien émotionnel mère"],
    content: `## L’IA qui lit entre les lignes

Une mère écrit : "mon bébé n’arrête pas de pleurer et je ne sais plus quoi faire."

N’importe quel assistant classique répondrait à propos des coliques ou du sommeil. Wilbor fait autre chose : **il lit entre les lignes**.

## Le système de lecture du contexte émotionnel

Wilbor possède une fonction exclusive — un système d’analyse qui fonctionne en arrière-plan, invisible pour la mère, mais présent dans chaque conversation.

### Ce qu’il identifie

Pendant que Wilbor répond à propos du bébé, le système analyse le message et identifie la **véritable souffrance de la mère** en catégories :

- **Épuisement extrême** — "je n’ai pas dormi depuis 3 jours"
- **Anxiété de performance** — "est-ce que je fais les choses correctement ?"
- **Épuisement émotionnel** — "je n’ai pas l’impression d’être une bonne mère"
- **Isolement social** — "je n’ai personne à qui parler"
- **Conflit relationnel** — "mon mari ne m’aide pas"
- **Peur du jugement** — "j’ai honte de poser la question"
- **Culpabilité maternelle** — "je crois que j’ai fait quelque chose de mal"
- **Manque de confiance** — "je ne sais pas si mon lait est suffisant"

### Niveaux d’attention

Pour chaque signal identifié, le système définit un niveau : **Faible**, **Moyen**, **Élevé** ou **Critique**.

## Pourquoi cela compte

L’épuisement maternel touche de nombreuses mères dans le monde — et la plupart ne demandent pas d’aide parce qu’elles ne reconnaissent pas leurs propres signes.

Wilbor ne pose pas de diagnostic. Mais il **perçoit** quand quelque chose va au-delà des pleurs du bébé. Et il répond avec une empathie calibrée pour ce moment précis.

---
**Cette fonction fonctionne de manière éthique, sans stocker de données sensibles au-delà de ce qui est nécessaire pour la session.**`,
  },
  {
    slug: "poussees-de-croissance-du-bebe",
    title: "Poussées de Croissance du Bébé : Signes et Comment Réagir",
    excerpt: "Reconnaissez les signes des poussées de croissance du bébé et apprenez à répondre avec patience aux changements de routine.",
    readTime: "4 min",
    metaTitle: "Poussées de Croissance du Bébé : Signes et Comment Réagir | Wilbor-Assist",
    metaDescription: "Reconnaissez les signes des poussées de croissance du bébé et apprenez à répondre avec patience aux changements de routine. Basé sur les protocoles de la SFP et de l'AAP.",
    keywords: ["poussée de croissance bébé", "bébé agité", "développement infantile", "bébé plus faim", "bébé pleureur"],
    content: `## Qu'est-ce qu'une poussée de croissance ?\n\nLes poussées de croissance sont des périodes de développement physique accéléré que chaque bébé traverse durant sa première année de vie. Ces phases peuvent perturber la routine établie, mais reconnaître les signes permet de réagir avec calme et sécurité.\n\n## Signes courants d'une poussée de croissance\n\n- **Plus de faim** \u2014 tète plus fréquemment que d'habitude\n- **Sommeil perturbé** \u2014 se réveille plus souvent la nuit\n- **Irritabilité** \u2014 pleure plus que la normale\n- **Besoin de proximité** \u2014 veut être porté en permanence\n\n## Quand cela se produit-il ?\n\nLes poussées de croissance surviennent généralement \u00e0 : **7\u201310 jours**, **2\u20133 semaines**, **4\u20136 semaines**, **3 mois**, **6 mois** et **9 mois**.\n\n## Comment agir\n\nSuivez le rythme de votre bébé. Offrez plus de tétées lorsqu'il montre des signes de faim et apportez beaucoup de contact et de réconfort. Les poussées de croissance durent en moyenne **2 \u00e0 3 jours**. Pour un accompagnement personnalisé, consultez Wilbor \u00e0 tout moment.\n\n---\n**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "ictere-neonatal-causes-et-traitement",
    title: "Ictère Néonatal : Causes, Symptômes et Traitement",
    excerpt: "Comprenez ce qu'est l'ictère néonatal, pourquoi il apparaît, quand consulter un médecin et comment il est traité.",
    readTime: "5 min",
    metaTitle: "Ictère Néonatal : Causes, Symptômes et Traitement | Wilbor-Assist",
    metaDescription: "Comprenez ce qu'est l'ictère néonatal, pourquoi il apparaît, quand consulter un médecin et comment il est traité. Basé sur les protocoles de la SFP et de l'AAP.",
    keywords: ["ictère néonatal", "bébé jaune", "bilirubine bébé", "ictère nouveau-né", "photothérapie bébé"],
    content: `## Qu'est-ce que l'ictère néonatal ?\n\nL'ictère néonatal est une condition **très fréquente** caractérisée par un jaunissement de la peau et du blanc des yeux du nouveau-né. Elle survient lorsqu'il y a un excès de **bilirubine** dans le sang du bébé.\n\n## Pourquoi cela se produit-il ?\n\nComme le foie du nouveau-né est encore en développement, il peut ne pas traiter la bilirubine suffisamment rapidement. La majorité des cas est **légère et se résout spontanément** en 1 \u00e0 2 semaines, \u00e0 mesure que le foie mûrit.\n\n## Quand consulter un médecin\n\nConsultez un professionnel de santé si :\n\n- L'ictère **apparaît dans les premières 24 heures** de vie\n- La coloration jaune **s'intensifie ou s'étend**\n- Le bébé est **très somnolent** ou difficile \u00e0 réveiller\n\n## Traitement\n\nLorsque les niveaux de bilirubine sont élevés, le médecin peut recommander une **photothérapie** \u2014 le bébé est placé sous des lumières bleues spéciales qui aident \u00e0 décomposer la bilirubine. Les cas graves sont rares.\n\n**Des tétées fréquentes** (lait maternel ou formule) aident le bébé \u00e0 éliminer la bilirubine par les selles.\n\n---\n**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "dentition-du-bebe-symptomes-et-soulagement",
    title: "Dentition du Bébé : Symptômes et Comment Soulager l'Inconfort",
    excerpt: "Votre bébé fait ses dents ? Découvrez les symptômes et des moyens sûrs de soulager l'inconfort des gencives.",
    readTime: "4 min",
    metaTitle: "Dentition du Bébé : Symptômes et Comment Soulager | Wilbor-Assist",
    metaDescription: "Votre bébé fait ses dents ? Découvrez les symptômes courants et les moyens sûrs et efficaces de soulager l'inconfort des gencives. Basé sur la SFP et l'AAP.",
    keywords: ["dentition bébé", "bébé qui fait ses dents", "gencives bébé", "première dent bébé", "anneau de dentition"],
    content: `## Quand commence la dentition ?\n\nLa dentition est une étape importante de la première année du bébé. La plupart des bébés ont leur **première dent vers 6 mois**, bien que cette période puisse varier considérablement.\n\n## Signes courants de la dentition\n\n- **Salivation excessive**\n- **Mord des objets** fréquemment\n- **Irritabilité** et agitation\n- **Gencives gonflées et sensibles**\n- Légère augmentation de la température corporelle (ce n'est pas de la fièvre)\n\n> Une fièvre supérieure \u00e0 **38\u00b0C** N'EST PAS causée par la dentition et doit être évaluée par un pédiatre.\n\n## Moyens sûrs de soulager l'inconfort\n\n- **Anneau de dentition réfrigéré** (non congelé)\n- **Linge humide froid** pour masser les gencives\n- **Massage doux avec le doigt** sur les gencives\n- Consultez le pédiatre concernant l'utilisation de **paracétamol** si nécessaire\n\n\u26a0\ufe0f **Évitez** les gels de dentition contenant de la **benzocaïne** \u2014 ils peuvent présenter des risques sérieux pour la santé du bébé.\n\n---\n**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "anxiete-post-partum-vs-depression-differences",
    title: "Anxiété Post-Partum vs Dépression Post-Partum : Différences Essentielles",
    excerpt: "Comprenez les différences entre l'anxiété post-partum et la dépression post-partum, et sachez quand consulter un professionnel.",
    readTime: "6 min",
    metaTitle: "Anxiété Post-Partum vs Dépression Post-Partum : Différences | Wilbor-Assist",
    metaDescription: "Comprenez les différences entre l'anxiété post-partum et la dépression post-partum, reconnaissez les symptômes et sachez quand consulter un professionnel.",
    keywords: ["anxiété post-partum", "dépression post-partum", "santé mentale maternelle", "baby blues", "trouble post-partum"],
    content: `## La période post-partum et la santé mentale\n\nLa période post-partum est un moment de transformations physiques et émotionnelles intenses. Bien que beaucoup connaissent le \"baby blues\", des troubles plus sérieux comme la **Dépression Post-Partum (DPP)** et l'**Anxiété Post-Partum (APP)** sont fréquents et souvent mal compris.\n\n## Principales différences\n\n| | Dépression Post-Partum (DPP) | Anxiété Post-Partum (APP) |\n|---|---|---|\n| **Sentiment principal** | Tristesse persistante, désespoir | Inquiétude excessive, peur |\n| **Pensées** | Négatives, vides | Rapides, catastrophiques |\n| **Symptômes physiques** | Fatigue, changement d'appétit | C\u0153ur accéléré, étourdissements |\n| **Relation avec le bébé** | Difficulté \u00e0 créer un lien | Surprotection excessive |\n\n## Important : les deux se traitent\n\nLa DPP et l'APP peuvent survenir en même temps. Les deux conditions sont **hautement traitables** avec un accompagnement professionnel \u2014 psychothérapie, médication ou groupes de soutien.\n\nRessentir cela **ne fait pas de vous une mauvaise mère**. C'est une condition de santé qui mérite de l'attention.\n\n---\n**Source :** Société Française de Pédiatrie (SFP) et Organisation Mondiale de la Santé (OMS).`,
  },
  {
    slug: "pourquoi-wilbor-ne-prescrit-jamais-de-medicaments",
    title: "Pourquoi Wilbor ne prescrit jamais de médicaments (et pourquoi c'est votre plus grande sécurité)",
    metaTitle: "Pourquoi Wilbor ne prescrit pas de médicaments | Wilbor-Assist",
    metaDescription: "Comprenez comment fonctionne le protocole de sécurité en 6 blocs de Wilbor et pourquoi une IA éthique ne devrait jamais calculer de doses ou prescrire des médicaments pour les bébés.",
    readTime: "5 min",
    excerpt: "Découvrez comment Wilbor utilise un protocole clinique en 6 blocs pour guider les mères sur les médicaments en toute sécurité, sans jamais remplacer le pédiatre.",
    keywords: ["prescription IA", "sécurité bébé", "protocole médical", "médicament bébé", "Wilbor sécurité"],
    content: `## La Fine Ligne Entre Aide et Risque\n\nQuand le bébé pleure au milieu de la nuit avec de la fièvre, le premier instinct de toute mère est de chercher un soulagement rapide. À l'ère de l'intelligence artificielle, il est tentant de demander à un chat : *"Combien de gouttes de paracétamol dois-je donner à mon bébé de 8 kg ?"*\n\nDe nombreuses IA génériques répondraient à cette question par un calcul mathématique. **Wilbor ne le fait pas.** Et il y a une raison très sérieuse à cela.\n\n## Le Protocole en 6 Blocs de Wilbor\n\nWilbor a été formé avec une directive non négociable : **la sécurité de votre bébé est au-dessus de toute commodité technologique.**\n\nLorsque vous posez des questions sur les médicaments, Wilbor active un protocole clinique rigoureux en 6 étapes :\n\n1. **Empathie :** Il comprend votre détresse et valide votre inquiétude.\n2. **Information Neutre :** Explique à quoi sert le médicament mentionné, sans encourager son utilisation.\n3. **Éducation sur le Dosage :** Explique que la dose dépend du poids et de la concentration, mais **ne fait jamais le calcul**.\n4. **Orientation Sûre :** Rappelle l'importance de confirmer la dose avec le pédiatre.\n5. **Triage Clinique :** Pose des questions essentielles (Depuis combien de temps ? Quelle est la température ? Y a-t-il d'autres symptômes ?).\n6. **Signes d'Alerte :** Indique exactement quand la situation cesse d'être un soin à domicile et devient une urgence hospitalière.\n\n## Pourquoi Est-ce Votre Plus Grande Sécurité ?\n\nUne erreur de calcul en milligrammes peut provoquer une intoxication grave chez un bébé. Une IA ne peut pas voir la concentration exacte du flacon que vous avez à la maison, ni évaluer l'état général de l'enfant.\n\nWilbor agit comme votre **réseau de soutien le plus intelligent et le plus sûr**. Il organise les informations, apaise votre cœur, vous dit quoi observer et quand courir à l'hôpital. Il vous donne les moyens d'agir grâce à la connaissance, mais ne franchit jamais la ligne de la responsabilité médicale.\n\nParce que prendre vraiment soin, c'est savoir exactement jusqu'où aller.\n\n---\n**Source :** Protocoles de Sécurité en Santé Numérique et Directives de la Société Française de Pédiatrie (SFP).`,
  },
];
// ============================================
// GERMAN (DE) ARTICLES
// ============================================
export const blogArticlesDE: BlogArticleTranslation[] = [
  {
    slug: "baby-schlaeft-nicht",
    title: "Baby schläft nicht: vollständiger Leitfaden nach Alter (0 bis 12 Monate)",
    excerpt: "Verstehen Sie die Schlafwachfenster Ihres Babys nach Alter und lernen Sie bewährte Techniken kennen, um die Nächte zu verbessern.",
    readTime: "8 Min Lesezeit",
    metaTitle: "Baby schläft nicht: vollständiger Leitfaden nach Alter (0 bis 12 Monate) | Wilbor",
    metaDescription: "Verstehen Sie die Schlafwachfenster Ihres Babys nach Alter und lernen Sie bewährte Techniken kennen, um die Nächte zu verbessern.",
    keywords: ["Baby schläft nicht", "Babyschlaf", "Schlafwachfenster", "Schlafroutine Baby"],
    content: `## Warum schläft mein Baby nicht?

Der Schlaf des Babys ist eine der größten Sorgen von Müttern. Laut der **Brasilianischen Gesellschaft für Pädiatrie (SBP)** variieren die Schlafmuster je nach Alter erheblich, und diese Phasen zu verstehen ist der erste Schritt zu ruhigeren Nächten.

## Schlafwachfenster nach Alter

Das **Schlafwachfenster** ist die maximale Zeit, die Ihr Baby wach bleiben kann, bevor es gereizt wird und Schwierigkeiten beim Einschlafen bekommt. Dieses Zeitfenster zu respektieren ist entscheidend.

| Alter | Schlafwachfenster | Gesamtschlaf/Tag | Nickerchen |
|-------|-------------------|------------------|------------|
| 0-1 Monat | 45-60 Min | 16-18 Std | 4-6 |
| 1-2 Monate | 60-90 Min | 15-17 Std | 4-5 |
| 3-4 Monate | 75-120 Min | 14-16 Std | 3-4 |
| 5-6 Monate | 2-2,5 Std | 14-15 Std | 2-3 |
| 7-9 Monate | 2,5-3 Std | 13-14 Std | 2 |
| 10-12 Monate | 3-4 Std | 12-14 Std | 1-2 |

## Schlafsignale

Achten Sie auf die Zeichen, die darauf hinweisen, dass Ihr Baby bereit zum Schlafen ist:

- **Frühe Signale:** Augen reiben, gähnen, starrer Blick, am Ohr ziehen
- **Späte Signale:** Weinen, Reizbarkeit, ruckartige Bewegungen, Überstrecken des Rückens

**Wichtiger Tipp:** Wenn Sie die späten Signale bemerken, hat Ihr Baby den idealen Zeitpunkt bereits überschritten. Versuchen Sie, es bei den ersten Anzeichen schlafen zu legen.

## Techniken zur Verbesserung des Schlafs

### Ideale Umgebung
- **Temperatur:** zwischen 22°C und 24°C
- **Dunkelheit:** verwenden Sie Verdunkelungsvorhänge
- **Weißes Rauschen:** Ventilator, App mit weißem Rauschen oder ein kontinuierliches „shhhh“
- **Position:** immer auf dem Rücken liegend (Empfehlung von SBP/AAP)

### Schlafroutine (ab 2-3 Monaten)
1. Lauwarmes Bad (nicht heiß)
2. Sanfte Massage mit langsamen Bewegungen
3. Stillen/Füttern in ruhiger und dunkler Umgebung
4. Schlaflied oder weißes Rauschen
5. Ins Bett legen, wenn das Baby schläfrig, aber noch wach ist

### Schlafregression (4 Monate)
Mit etwa 4 Monaten durchlaufen viele Babys eine **Schlafregression**. Das passiert, weil das Schlafmuster reift. Es ist vorübergehend (1-3 Wochen) und Teil der normalen Entwicklung.

## Wann Sie den Kinderarzt aufsuchen sollten

- Das Baby schnarcht oder macht Atempausen im Schlaf
- Es schläft nach dem 4. Monat nicht länger als 30 Minuten am Stück
- Extreme Reizbarkeit, die sich mit keiner Technik bessert
- Gewichtsverlust oder damit verbundene Nahrungsverweigerung

---

**Quelle:** Protokolle der Brasilianischen Gesellschaft für Pädiatrie (SBP) und der American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "bauchkoliken-baby",
    title: "Bauchkoliken beim Baby: was Sie zur Linderung tun können (praktischer Leitfaden)",
    excerpt: "Bewährte Techniken zur Linderung von Koliken: Shantala-Massage, Fliegergriff, Swaddle und mehr.",
    readTime: "6 Min Lesezeit",
    metaTitle: "Bauchkoliken beim Baby: was Sie zur Linderung tun können (praktischer Leitfaden) | Wilbor",
    metaDescription: "Bewährte Techniken zur Linderung von Koliken: Shantala-Massage, Fliegergriff, Swaddle und mehr.",
    keywords: ["Bauchkoliken Baby", "Shantala-Massage", "Koliken lindern", "Baby weint"],
    content: `## Was sind Bauchkoliken beim Baby?

Koliken werden durch die **3er-Regel** definiert: intensives Weinen von mehr als **3 Stunden pro Tag**, an mehr als **3 Tagen pro Woche**, über mehr als **3 Wochen**. Sie betreffen etwa 20-25 % der Babys und beginnen normalerweise zwischen der 2. und 3. Lebenswoche.

## Wann sie auftreten

- **Beginn:** 2.-3. Lebenswoche
- **Höhepunkt:** 6.-8. Woche
- **Ende:** in der Regel mit 3-4 Monaten
- **Häufigste Zeit:** spätnachmittags und früher Abend (17-23 Uhr)

## Bewährte Linderungstechniken

### 1. Shantala-Massage (I-L-U)
Die I-L-U-Technik ist eine Bauchmassage, die dem Verlauf des Darms folgt:

1. **I** — Streichen Sie mit der Hand an der linken Seite des Babys von oben nach unten
2. **L** — Streichen Sie von rechts nach links und dann nach unten (es entsteht ein umgekehrtes L)
3. **U** — Streichen Sie an der rechten Seite von unten nach oben, überqueren Sie oben und streichen Sie an der linken Seite nach unten (es entsteht ein umgekehrtes U)

**Wann anwenden:** wenn das Baby ruhig ist, vor der Krise. Verwenden Sie Pflanzenöl an den Händen.

### 2. Fliegergriff
Legen Sie das Baby bäuchlings auf Ihren Unterarm, mit dem Kopf in Ihrer Hand abgestützt. Der sanfte Druck auf den Bauch hilft, Gase zu lösen.

### 3. Swaddle (Pucken)
Wickeln Sie das Baby fest in ein Tuch oder Pucktuch, mit den Armen nah am Körper. Das simuliert die Umgebung im Mutterleib und reduziert den Moro-Reflex.

**Achtung:** Hören Sie mit dem Pucken auf, sobald das Baby beginnt, sich zu drehen (etwa mit 2-3 Monaten).

### 4. Weißes Rauschen + Wiegen
Ein kontinuierliches „shhhh“ nah am Ohr des Babys, kombiniert mit sanftem Wiegen, aktiviert den Beruhigungsreflex. Das Geräusch sollte so laut sein wie das Weinen des Babys.

### 5. Fahrradbewegung
Legen Sie das Baby auf den Rücken und machen Sie mit seinen Beinchen Fahrradbewegungen. Das hilft, feststeckende Gase zu lösen.

## Was Sie NICHT tun sollten

- **Geben Sie keine Tees oder Medikamente** ohne Anweisung des Kinderarztes
- **Schütteln Sie das Baby nicht** — das kann schwere Hirnverletzungen verursachen (Schütteltrauma)
- **Ändern Sie die Säuglingsnahrung nicht** ohne ärztliche Anweisung
- **Machen Sie sich keine Vorwürfe** — Koliken werden nicht durch etwas verursacht, das Sie getan oder unterlassen haben

## Wann Sie den Kinderarzt aufsuchen sollten

- Fieber über 37,8°C
- Häufiges Erbrechen oder schwallartiges Erbrechen
- Blut im Stuhl
- Nahrungsverweigerung über mehr als 8 Stunden
- Untröstliches Baby über mehr als 4 Stunden am Stück

---

**Quelle:** Protokolle der Brasilianischen Gesellschaft für Pädiatrie (SBP) und der American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "fieber-baby",
    title: "Fieber beim Baby: wann ins Krankenhaus gehen (Leitfaden nach Alter)",
    excerpt: "Erfahren Sie, wann Fieber beim Baby ein Notfall ist, wie man richtig misst und was in jedem Alter zu tun ist.",
    readTime: "5 Min Lesezeit",
    metaTitle: "Fieber beim Baby: wann ins Krankenhaus gehen (Leitfaden nach Alter) | Wilbor",
    metaDescription: "Erfahren Sie, wann Fieber beim Baby ein Notfall ist, wie man richtig misst und was in jedem Alter zu tun ist.",
    keywords: ["Fieber Baby", "Kinderarzt Fieber", "Temperatur Baby", "Fieber Säugling"],
    content: `## Wann ist Fieber ein Notfall?

Fieber ist einer der häufigsten Gründe für eine kinderärztliche Konsultation. Laut der **SBP** hängt das richtige Vorgehen direkt vom **Alter des Babys** ab.

## Einteilung nach Temperatur

| Axilläre Temperatur | Einteilung |
|---------------------|-----------|
| Bis 37,2°C | Normal |
| 37,3°C - 37,5°C | Erhöhte Temperatur |
| 37,6°C - 38,9°C | Fieber |
| 39°C - 40°C | Hohes Fieber |
| Über 40°C | Sehr hohes Fieber (Notfall) |

## Vorgehen nach Alter

### 0-3 Monate: IMMER ein Notfall
Jedes Fieber bei einem Baby unter 3 Monaten erfordert eine **sofortige ärztliche Beurteilung**. In diesem Alter ist das Immunsystem unreif und Infektionen können sich schnell verschlechtern.

**Gehen Sie ins Krankenhaus, wenn:** die Axillartemperatur über 37,5°C liegt.

### 3-6 Monate: erhöhte Aufmerksamkeit
- Fieber über 38,5°C → suchen Sie den Kinderarzt auf
- Fieber, das länger als 24 Stunden anhält → suchen Sie den Kinderarzt auf
- Reizbares, apathisches Baby oder Verweigerung des Stillens → Notfall

### 6-12 Monate: Allgemeinzustand beobachten
- Fieber über 39°C → suchen Sie den Kinderarzt auf
- Fieber, das länger als 48-72 Stunden anhält → suchen Sie den Kinderarzt auf
- Wenn das Baby aktiv ist, spielt und gut trinkt, beobachten Sie es zu Hause

## Wie man richtig misst

1. Verwenden Sie ein digitales Thermometer (niemals ein Quecksilberthermometer)
2. Legen Sie es 3-5 Minuten in die Achselhöhle
3. Halten Sie den Arm des Babys eng am Körper
4. Messen Sie, wenn das Baby ruhig ist (nicht direkt nach dem Stillen oder Weinen)

## Maßnahmen zur Erleichterung

- **Flüssigkeitszufuhr:** bieten Sie häufig Brust oder Wasser an
- **Leichte Kleidung:** entfernen Sie überschüssige Kleidung und Decken
- **Kühle Umgebung:** halten Sie das Zimmer gut belüftet
- **Lauwarmes Bad:** kann helfen, die Temperatur zu senken (niemals kalt)
- **Lauwarme Umschläge:** in den Achselhöhlen und Leisten (niemals Alkohol)

## Warnzeichen (gehen Sie ins Krankenhaus)

- Fieber bei einem Baby unter 3 Monaten
- Temperatur über 40°C in jedem Alter
- Fieberkrampf (Zittern, verdrehte Augen)
- Violette Flecken auf der Haut
- Atembeschwerden
- Extreme Apathie (Baby „schlaff“, ohne Reaktion)
- Vorgewölbte Fontanelle
- Untröstliches Weinen über Stunden

---

**Quelle:** Protokolle der Brasilianischen Gesellschaft für Pädiatrie (SBP) und der American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "beikosteinfuehrung",
    title: "Beikosteinführung: vollständiger Leitfaden für den Start (BLW und traditionell)",
    excerpt: "Alles über die Beikosteinführung: wann beginnen, BLW vs. traditionell, Lebensmittel nach Alter und wie Allergene eingeführt werden.",
    readTime: "7 Min Lesezeit",
    metaTitle: "Beikosteinführung: vollständiger Leitfaden für den Start (BLW und traditionell) | Wilbor",
    metaDescription: "Alles über die Beikosteinführung: wann beginnen, BLW vs. traditionell, Lebensmittel nach Alter und wie Allergene eingeführt werden.",
    keywords: ["Beikosteinführung", "BLW", "Beikost beginnen", "Babybrei"],
    content: `## Wann beginnen?

Die **Brasilianische Gesellschaft für Pädiatrie (SBP)** und die **WHO (OMS)** empfehlen ausschließliches Stillen bis zu den **vollendeten 6 Monaten**. Die Beikosteinführung sollte mit 6 Monaten beginnen, wenn das Baby Anzeichen der Bereitschaft zeigt.

## Anzeichen der Bereitschaft

- Kann mit minimaler Unterstützung sitzen
- Hält den Kopf stabil
- Hat den Zungenstoßreflex verloren (schiebt Nahrung nicht mehr heraus)
- Zeigt Interesse am Essen der Erwachsenen
- Kann Gegenstände greifen und zum Mund führen

## Methoden: BLW vs. Traditionell vs. Gemischt

### BLW (Baby-Led Weaning)
Das Baby isst selbstständig mit den Händen und mit geeigneten Stücken von Lebensmitteln.

**Vorteile:** Selbstständigkeit, motorische Entwicklung, Akzeptanz von Texturen.  
**Worauf achten:** sichere Schnittform (Streifen in Fingergröße), ständige Aufsicht.

### Traditionell (Brei)
Mit der Gabel zerdrückte Lebensmittel (nicht püriert), die mit dem Löffel angeboten werden.

**Vorteile:** bessere Mengensteuerung, weniger Unordnung.  
**Worauf achten:** Texturen schrittweise weiterentwickeln, keinen Mixer verwenden.

### Gemischt (von der SBP empfohlen)
Kombiniert beide Methoden je nach Mahlzeit und Situation.

## Lebensmittel nach Alter

| Alter | Lebensmittel | Textur |
|-------|--------------|--------|
| 6 Monate | Obst, Gemüse, Knollen | Zerdrückt oder große Streifen |
| 7 Monate | + Bohnen, Linsen, Getreide | Zerdrückt mit kleinen Stückchen |
| 8 Monate | + Ganzes Ei, Fisch, Kichererbsen | Klein gehackt |
| 9 Monate | + Nudeln, Couscous | Größere Stücke |
| 10-12 Monate | Familienkost | Angepasst (ohne Salz/Zucker) |

## Allergene: wann und wie einführen

Die SBP empfiehlt, **Allergene früh einzuführen** (ab 6 Monaten), da dies das Allergierisiko **verringern** kann:

1. **Ei:** beginnen Sie mit gekochtem Eigelb, dann Eiweiß
2. **Erdnuss:** verdünnte Paste im Püree (niemals ganz — Erstickungsgefahr)
3. **Kuhmilch:** in Zubereitungen (nicht als Hauptgetränk vor dem 1. Lebensjahr)
4. **Weizen:** Brot, Nudeln
5. **Fisch:** beginnen Sie mit weißen Fischen

**Regel:** Führen Sie alle 3 Tage 1 neues Allergen ein und beobachten Sie Reaktionen (Flecken, Schwellungen, Erbrechen).

## Was Sie vor dem 1. Lebensjahr NIEMALS geben sollten

- **Honig** (Botulismusrisiko)
- **Salz und Zucker** (unnötig und schädlich)
- **Kuhmilch als Getränk** (durch Muttermilch oder Säuglingsnahrung ersetzen)
- **Ganze runde Lebensmittel** (Trauben, Cherrytomaten — halbieren)
- **Harte und kleine Lebensmittel** (ganze Erdnüsse, Popcorn)

---

**Quelle:** Protokolle der SBP, OMS und AAP.`,
  },
  {
    slug: "impfkalender-baby",
    title: "Impfungen für Babys: vollständiger Impfkalender und was zu erwarten ist",
    excerpt: "Vollständiger Impfkalender des ersten Jahres, normale Nebenwirkungen und wie Beschwerden gelindert werden können.",
    readTime: "5 Min Lesezeit",
    metaTitle: "Impfungen für Babys: vollständiger Impfkalender und was zu erwarten ist | Wilbor",
    metaDescription: "Vollständiger Impfkalender des ersten Jahres, normale Nebenwirkungen und wie Beschwerden gelindert werden können.",
    keywords: ["Impfungen Baby", "Impfkalender", "Impfungen Säugling"],
    content: `## Warum impfen?

Impfungen sind die wirksamste Maßnahme der öffentlichen Gesundheit in der Geschichte. Laut der **WHO (OMS)** verhindern Impfstoffe weltweit 2-3 Millionen Todesfälle pro Jahr. Für Babys ist die Immunisierung in den ersten Monaten besonders wichtig, weil das Immunsystem noch unreif ist.

## Impfkalender des ersten Jahres

| Alter | Impfungen |
|-------|-----------|
| Bei der Geburt | BCG, Hepatitis B |
| 2 Monate | Penta (DTP+Hib+HepB), IPV (Polio), Pneumo 10, Rotavirus |
| 3 Monate | Meningokokken C |
| 4 Monate | Penta, IPV, Pneumo 10, Rotavirus |
| 5 Monate | Meningokokken C |
| 6 Monate | Penta, IPV, Influenza |
| 9 Monate | Gelbfieber |
| 12 Monate | MMR, Pneumo 10 (Auffrischung), Meningokokken C (Auffrischung) |

## Normale Nebenwirkungen

### Lokal (an der Einstichstelle)
- Rötung, Schwellung, Verhärtung
- Schmerz bei Berührung
- Dauer: 1-3 Tage

### Systemisch (allgemein)
- Leichtes Fieber (bis 38,5°C) — besonders nach der Penta-Impfung
- Reizbarkeit, Weinen
- Schläfrigkeit oder Unruhe
- Dauer: 24-48 Stunden

### Wie man lindern kann
- **Fiebersenkendes Mittel:** Paracetamol oder Ibuprofen (nach Anweisung des Kinderarztes)
- **Kalte Umschläge** an der Einstichstelle
- **Stillen** — Trost und natürliche Schmerzlinderung
- **Körperkontakt und Zuwendung** — das Baby braucht Sicherheit

## Mythen über Impfungen

**„Impfungen verursachen Autismus“** — FALSCH. Die ursprüngliche Studie war betrügerisch und wurde zurückgezogen. Keine seriöse Studie bestätigt diesen Zusammenhang.

**„Impfungen überlasten das Immunsystem“** — FALSCH. Das Baby ist täglich Tausenden von Antigenen ausgesetzt. Impfstoffe machen nur einen minimalen Bruchteil davon aus.

**„Es ist besser, die Krankheit natürlich durchzumachen“** — FALSCH. Krankheiten wie Masern, Keuchhusten und Meningitis können schwere Folgeschäden oder den Tod verursachen.

## Wann NICHT geimpft werden sollte (echte Kontraindikationen)

- Hohes Fieber am Tag der Impfung (über 38,5°C)
- Anaphylaktische Reaktion auf eine vorherige Dosis
- Schwere Immunschwäche (bei Lebendimpfstoffen)

**Eine leichte Erkältung ist KEINE Kontraindikation** — es kann normal geimpft werden.

## Tipps für den Impftag

1. Nehmen Sie den Impfpass mit
2. Stillen Sie vor und nach der Impfung (natürliche Schmerzlinderung)
3. Nehmen Sie ein Lieblingsspielzeug zur Ablenkung mit
4. Versprechen Sie nicht, dass „es nicht wehtun wird“ — seien Sie ehrlich
5. Halten Sie das Baby während der Impfung im Arm

---

**Quelle:** Nationaler Impfkalender (Gesundheitsministerium), SBP und OMS.`,
  },
  {
    slug: "stillen-leitfaden",
    title: "Stillen: vollständiger Leitfaden für die ersten Monate",
    excerpt: "Richtige Anlegetechnik, Milchproduktion, häufige Schmerzen und wie die Herausforderungen des Stillens gemeistert werden können.",
    readTime: "7 Min Lesezeit",
    metaTitle: "Stillen: vollständiger Leitfaden für die ersten Monate | Wilbor",
    metaDescription: "Richtige Anlegetechnik, Milchproduktion, häufige Schmerzen und wie die Herausforderungen des Stillens gemeistert werden können.",
    keywords: ["Stillen", "Anlegen Baby", "Stillen lernen", "Muttermilch"],
    content: `## Warum stillen?

Muttermilch ist in den ersten Lebensmonaten die vollständigste Nahrung für das Baby. Die **WHO (OMS)** und die **SBP** empfehlen:
- **Ausschließliches Stillen** bis zum 6. Monat
- **Ergänzendes Stillen** (zusammen mit anderen Lebensmitteln) bis zum Alter von 2 Jahren oder länger

## Vorteile der Muttermilch

### Für das Baby
- Schutz vor Infektionen (mütterliche Antikörper)
- Verringerung von Allergien, Asthma und Diabetes
- Entwicklung von Gehirn und Sehvermögen
- Verringerung des Risikos des plötzlichen Kindstods
- Schutz vor Adipositas im Erwachsenenalter

### Für die Mutter
- Verringerung des Risikos für Brust- und Eierstockkrebs
- Schnellere Rückbildung der Gebärmutter
- Stärkere emotionale Bindung
- Finanzielle Entlastung

## Das richtige Anlegen

Das Anlegen ist der wichtigste Faktor für erfolgreiches Stillen.

### Anzeichen für richtiges Anlegen
- Mund weit geöffnet (mehr als 120°)
- Unterlippe nach außen gestülpt
- Kinn berührt die Brust
- Mehr Warzenhof oberhalb als unterhalb sichtbar
- Runde Wangen (nicht eingefallen)
- Sie spüren keine Schmerzen (Druck ist möglich, aber kein Schmerz)

### Stillpositionen
1. **Wiegehaltung** — Baby im Arm, Bauch an Bauch
2. **Rückengriff (Football-Haltung)** — Baby unter dem Arm, ideal nach Kaiserschnitt
3. **Seitliches Liegen** — gut für die Nacht
4. **Koala** — Baby sitzt auf dem Oberschenkel

## Milchproduktion: wie sie funktioniert

Milch wird **nach Bedarf** produziert: Je mehr das Baby trinkt, desto mehr Milch wird gebildet. In den ersten Tagen ist das **Kolostrum** (die gelbliche Vormilch) ausreichend — es muss nicht ergänzt werden.

### Anzeichen für ausreichende Milchmenge
- Das Baby hat mindestens **6 nasse Windeln** pro Tag
- Es nimmt angemessen zu (bei der Untersuchung überprüfen)
- Es trinkt häufig (anfangs 8-12 Mal/Tag) und wirkt zufrieden

## Häufige Schmerzen und Probleme

### Brustwarzenrisse
**Ursache:** falsches Anlegen.  
**Lösung:** das Anlegen korrigieren. Tragen Sie nach dem Stillen Muttermilch auf die Brustwarze auf (natürliche Wundheilung).

### Milchstau
**Ursache:** angesammelte Milch.  
**Lösung:** warme Kompresse vor dem Stillen, kalte Kompresse danach. Die Brust häufig entleeren.

### Mastitis
**Ursache:** bakterielle Infektion.  
**Symptome:** Fieber, Rötung, starke Schmerzen.  
**Lösung:** stillen Sie weiter (es verschlimmert die Infektion nicht), suchen Sie den Arzt für ein Antibiotikum auf.

## Tipps zur Steigerung der Milchproduktion

- **Stillen Sie häufig** — anfangs 8-12 Mal/Tag
- **Bieten Sie beide Brüste** bei jeder Mahlzeit an
- **Ruhen Sie sich aus**, wenn das Baby schläft
- **Vermeiden Sie unnötige Zufütterung** (die Flasche reduziert die Stimulation)
- **Pumpen oder streichen Sie Milch aus** zwischen den Mahlzeiten, um zu stimulieren

### Baby verweigert die Brust
- Versuchen Sie es in ruhiger und dunkler Umgebung
- Bieten Sie die Brust an, wenn das Baby schläfrig ist
- Haut an Haut (Baby nur mit Windel auf dem Schoß der Mutter)
- Prüfen Sie, ob ein kurzes Zungenband vorliegt

## Wann Sie Hilfe suchen sollten

- Schmerzen, die nach Korrektur des Anlegens nicht besser werden
- Risse, die bluten oder nicht heilen
- Fieber + Rötung an der Brust (mögliche Mastitis)
- Das Baby nimmt nicht angemessen zu
- Das Baby hat nicht mindestens 6 nasse Windeln pro Tag

---

**Quelle:** Brasilianische Gesellschaft für Pädiatrie (SBP), OMS und Grundversorgungsheft Nr. 23 (Gesundheitsministerium).`,
  },
  {
    slug: "motorische-entwicklung-baby",
    title: "Motorische Entwicklung des Babys: Meilensteine und wie man sie fördert",
    excerpt: "Meilensteine der motorischen Entwicklung Monat für Monat und Aktivitäten zur Förderung jeder Phase.",
    readTime: "6 Min Lesezeit",
    metaTitle: "Motorische Entwicklung des Babys: Meilensteine und wie man sie fördert | Wilbor",
    metaDescription: "Meilensteine der motorischen Entwicklung Monat für Monat und Aktivitäten zur Förderung jeder Phase.",
    keywords: ["motorische Entwicklung Baby", "Entwicklungsmeilensteine", "Baby krabbeln laufen"],
    content: `## Warum ist die motorische Entwicklung wichtig?

Die motorische Entwicklung ist einer der wichtigsten Indikatoren für die neurologische Gesundheit des Babys. Laut der **SBP** hilft die Beobachtung motorischer Meilensteine dabei, Anzeichen von Verzögerungen frühzeitig zu erkennen, die deutlich wirksamer behandelt werden können, wenn sie früh entdeckt werden.

## Motorische Meilensteine Monat für Monat

| Alter | Erwarteter Meilenstein | Warnzeichen |
|-------|------------------------|-------------|
| 1 Monat | Hebt in Bauchlage kurz den Kopf | Reagiert nicht auf Geräusche |
| 2 Monate | Hält den Kopf einige Sekunden | Fixiert den Blick nicht |
| 3 Monate | Hält den Kopf sicher | Lächelt nicht |
| 4 Monate | Dreht sich vom Bauch auf den Rücken | Hält keine Gegenstände fest |
| 5 Monate | Sitzt mit Unterstützung | Überträgt keine Gegenstände |
| 6 Monate | Sitzt ohne Unterstützung (einige) | Sitzt nicht mit Unterstützung |
| 7 Monate | Krabbelt oder robbt | Steht nicht mit Unterstützung |
| 8 Monate | Steht mit Unterstützung | Krabbelt nicht |
| 9 Monate | Geht mit Unterstützung | Nutzt keinen Pinzettengriff |
| 10 Monate | Erste Schritte (einige) | Zeigt nicht |
| 11 Monate | Geht sicher mit Unterstützung | Imitiert keine Gesten |
| 12 Monate | Geht allein (die meisten) | Spricht kein einziges Wort |

## Förderaktivitäten nach Phase

### 0-3 Monate: sensorische Förderung
- **Tummy time** (Bauchlagezeit): 3-5 Minuten, 3x pro Tag — stärkt Nacken und Schultern
- **Visuelle Kontraste:** zeigen Sie schwarz-weiße Gegenstände (das Sehen entwickelt sich noch)
- **Mobile:** in 20-30 cm Abstand vom Gesicht aufgehängt
- **Hautkontakt:** stimuliert das Nervensystem und die Bindung

### 4-6 Monate: Koordination und Greifen
- **Bieten Sie Spielzeuge an**, die gegriffen werden können (Rassel, Gummiring)
- **Spiegel:** Babys schauen sich gern selbst an
- **Drehen:** helfen Sie dem Baby beim Drehen, indem Sie ein Spielzeug daneben platzieren
- **Sitzen mit Unterstützung:** verwenden Sie Kissen oder Ihren Schoß

### 7-9 Monate: Mobilität und Erkundung
- **Sicherer Platz auf dem Boden** zum Krabbeln
- **Sanfte Hindernisse** (Kissen) zum Überwinden
- **Rollende Spielzeuge** zum Hinterherkrabbeln
- **Kisten und Behälter** zum Öffnen und Schließen (Koordination)

### 10-12 Monate: erste Schritte
- **Schiebewagen** (nicht der Sitzlauflerner — von der SBP verboten)
- **Unterschiedliche Oberflächen:** Teppich, Gras, Sand (fördert die Propriozeption)
- **Niedrige Treppenstufen** unter Aufsicht
- **Stehend spielen** mit Unterstützung am Sofa

## Wann Sie den Kinderarzt aufsuchen sollten

- Hält mit 4 Monaten den Kopf nicht
- Sitzt mit 9 Monaten nicht ohne Unterstützung
- Geht mit 18 Monaten nicht
- Hat bereits erworbene Fähigkeiten verloren
- Bewegungsasymmetrie (nutzt eine Körperseite mehr)
- Hypertonie oder Hypotonie (sehr steif oder sehr „schlaff“)

---

**Quelle:** Brasilianische Gesellschaft für Pädiatrie (SBP) und Denver Developmental Screening Test.`,
  },
  {
    slug: "babysicherheit-zuhause",
    title: "Sicherheit des Babys zu Hause: Unfallprävention nach Alter",
    excerpt: "Prävention häuslicher Unfälle nach Alter: Stürze, Verschlucken, Verbrennungen und mehr.",
    readTime: "6 Min Lesezeit",
    metaTitle: "Sicherheit des Babys zu Hause: Unfallprävention nach Alter | Wilbor",
    metaDescription: "Prävention häuslicher Unfälle nach Alter: Stürze, Verschlucken, Verbrennungen und mehr.",
    keywords: ["Babysicherheit", "Unfallprävention Baby", "Stürze Baby verhindern"],
    content: `## Unfälle zu Hause: die wichtigste vermeidbare Todesursache

Laut der **SBP** sind häusliche Unfälle die **wichtigste vermeidbare Todesursache bei Kindern von 1 bis 14 Jahren**. Die meisten sind mit einfachen Sicherheitsmaßnahmen **vermeidbar**.

## Risiken nach Alter

### 0-3 Monate: Stürze und Erstickung
- **Lassen Sie das Baby niemals allein** auf hohen Flächen (Wickeltisch, Bett, Sofa)
- **Sicherer Schlaf:** immer auf dem Rücken, ohne Kissen, lose Decken oder Kuscheltiere im Bett
- **Verwenden Sie keine Bettumrandungen** (Erstickungsgefahr)
- **Achten Sie auf Schnüre** von Vorhängen, Schnullern und Kleidung in Halsnähe

### 4-6 Monate: Stürze und kleine Gegenstände
- Das Baby beginnt, sich zu drehen — **lassen Sie es niemals allein** auf ungesicherten Flächen
- **Alles wandert in den Mund** — entfernen Sie kleine Gegenstände aus der Reichweite (Münzen, Knöpfe, Deckel)
- **Hochstuhl** mit Sicherheitsgurt
- **Verwenden Sie keinen Lauflerner** (von der SBP verboten — Risiko schwerer Stürze)

### 7-9 Monate: Krabbeln = alles erkunden
- **Installieren Sie Schutzgitter** an Treppen (oben und unten)
- **Sichern Sie Steckdosen** mit Schutzkappen
- **Verriegeln Sie Schränke** mit Reinigungsmitteln, Medikamenten und scharfen Gegenständen
- **Schützen Sie Ecken** von Tischen und Möbeln
- **Befestigen Sie schwere Möbel** an der Wand (Regale, Kommoden, Fernseher)

### 10-12 Monate: erste Schritte = mehr Stürze
- **Rutschfeste Teppiche** in Bad und Küche
- **Türen mit Sicherung** für Küche und Bad
- **Topfgriffe** nach innen zum Herd drehen
- **Stromkabel** außer Reichweite
- **Fenster mit Schutznetz** oder Öffnungsbegrenzer

## Verschlucken: was tun

### Baby unter 1 Jahr (angepasstes Heimlich-Manöver)
1. Legen Sie das Baby **bäuchlings auf Ihren Unterarm**, mit dem Kopf tiefer als dem Körper
2. Geben Sie **5 kräftige Schläge** zwischen die Schulterblätter
3. Wenn das nicht hilft, **drehen Sie es auf den Rücken** und machen Sie **5 Druckbewegungen** in der Mitte des Brustkorbs (2 Finger)
4. **Wiederholen Sie**, bis der Gegenstand herauskommt oder das Baby hustet/weint
5. Wenn es das Bewusstsein verliert, **rufen Sie den Notdienst** und beginnen Sie mit der Wiederbelebung

### Vorbeugung gegen Verschlucken
- Schneiden Sie Lebensmittel in kleine, altersgerechte Stücke
- **Gefährliche Lebensmittel:** ganze Trauben, Popcorn, Erdnüsse, Wurstscheiben, harte Bonbons
- Beaufsichtigen Sie **alle** Mahlzeiten
- Geben Sie im fahrenden Auto keine Lebensmittel

## Verbrennungen: Vorbeugung

- **Testen Sie die Wassertemperatur** beim Baden (ideal: 37°C) — mit dem Ellenbogen
- **Halten Sie das Baby nicht**, während Sie heiße Getränke trinken
- **Kochen Sie auf den hinteren Herdplatten**
- **Bügeleisen:** bewahren Sie es heiß an einem hohen, unzugänglichen Ort auf
- **Sonnenschutzmittel:** erst ab 6 Monaten

## Ertrinken: erhöhte Aufmerksamkeit

- **Lassen Sie das Baby niemals allein** in der Badewanne, im Pool oder bei einem Eimer — nicht einmal für 1 Sekunde
- Babys können in **weniger als 5 cm Wasser** ertrinken
- **Leeren Sie Eimer und Schüsseln** nach dem Gebrauch
- **Pools:** Zaun von etwa 1,5 m mit Tor und Verschluss

## Erste-Hilfe-Set

Halten Sie zu Hause bereit:
- Digitales Thermometer
- Kochsalzlösung
- Sterile Gaze
- Micropore
- Schere mit abgerundeter Spitze
- Vom Kinderarzt verordnetes fiebersenkendes Mittel
- Sichtbare Nummer des Notdienstes und des Kinderarztes

---

**Quelle:** Brasilianische Gesellschaft für Pädiatrie (SBP) und Gesundheitsministerium — Programm zur Prävention von Unfällen im Kindesalter.`,
  },
  {
    slug: "entwicklungsspruenge-baby",
    title: "Entwicklungssprünge beim Baby: was Monat für Monat zu erwarten ist",
    excerpt: "Wann Entwicklungssprünge auftreten, die Zeichen jeder Phase und wie man mit der Reizbarkeit des Babys umgeht.",
    readTime: "7 Min Lesezeit",
    metaTitle: "Entwicklungssprünge beim Baby: was Monat für Monat zu erwarten ist | Wilbor",
    metaDescription: "Wann Entwicklungssprünge auftreten, die Zeichen jeder Phase und wie man mit der Reizbarkeit des Babys umgeht.",
    keywords: ["Entwicklungssprünge Baby", "Wachstumsschub Baby", "Baby irritabel"],
    content: `## Was sind Entwicklungssprünge?

**Entwicklungssprünge** sind Phasen, in denen das Gehirn des Babys eine **intensive neurologische Reorganisation** durchläuft. In diesen Zeiten erwirbt das Baby neue Fähigkeiten — doch dieser Prozess kann es reizbar, weinerlich und anhänglich machen.

## Kalender der Entwicklungssprünge (0-12 Monate)

| Woche | Ca. Alter | Was sich verändert | Dauer |
|-------|------------|--------------------|-------|
| Woche 5 | 1 Monat | Empfindungen (schärferes Sehen und Hören) | 1-2 Wochen |
| Woche 8 | 2 Monate | Muster (erkennt Gesichter, Hände) | 1-2 Wochen |
| Woche 12 | 3 Monate | Sanfte Übergänge (koordiniertere Bewegungen) | 1-2 Wochen |
| Woche 19 | 4,5 Monate | Ereignisse (versteht Ursache und Wirkung) | 1-5 Wochen |
| Woche 26 | 6 Monate | Beziehungen (Entfernung, innen/außen) | 1-5 Wochen |
| Woche 37 | 8,5 Monate | Kategorien (gruppiert Gegenstände nach Ähnlichkeit) | 3-6 Wochen |
| Woche 46 | 10,5 Monate | Sequenzen (versteht die Reihenfolge von Dingen) | 3-6 Wochen |
| Woche 55 | 12,5 Monate | Programme (testet Strategien, löst Probleme) | 3-6 Wochen |

## Zeichen dafür, dass das Baby einen Sprung durchmacht

- **Weinerlicher und reizbarer** als gewöhnlich
- **Anhänglicher** — möchte ständig auf den Arm
- **Veränderter Schlaf** — wacht häufiger auf, schläft weniger
- **Veränderter Appetit** — trinkt mehr oder verweigert
- **Trennungsangst** — weint, wenn Sie das Sichtfeld verlassen

## Entwicklungsmeilensteine Monat für Monat

### 1 Monat
- Fixiert kurz den Blick
- Reagiert auf laute Geräusche
- Hebt in Bauchlage kurz den Kopf

### 2 Monate
- Erstes soziales Lächeln
- Folgt Gegenständen mit den Augen
- Macht Laute („ahhh“, „ohhh“)

### 3 Monate
- Hält den Kopf
- Lacht laut
- Öffnet und schließt die Hände
- Entdeckt die eigenen Hände

### 4 Monate
- Dreht sich vom Bauch auf den Rücken (oder umgekehrt)
- Greift Gegenstände mit beiden Händen
- Erkennt vertraute Gesichter

### 5-6 Monate
- Sitzt mit Unterstützung
- Übergibt Gegenstände von einer Hand in die andere
- Lallt Silben („ba-ba“, „ma-ma“)
- Beginnt, Vorlieben für Personen zu zeigen

### 7-8 Monate
- Sitzt ohne Unterstützung
- Krabbelt (oder robbt)
- Trennungsangst (weint bei Fremden)
- Klatscht, winkt

### 9-10 Monate
- Steht mit Unterstützung
- Pinzettengriff (greift kleine Gegenstände mit Daumen und Zeigefinger)
- Versteht „nein“
- Zeigt auf das, was es will

### 11-12 Monate
- Erste Schritte (mit oder ohne Unterstützung)
- Erste bedeutungsvolle Wörter („Mama“, „Papa“)
- Imitiert Gesten und Laute
- Spielt Verstecken

## Wie man während der Sprünge helfen kann

1. **Mehr Arm und Hautkontakt** — das Baby braucht Sicherheit
2. **Stillen Sie häufiger** — Trost + Ernährung
3. **Halten Sie die Routine aufrecht** — Vorhersehbarkeit beruhigt
4. **Bieten Sie geeignete Reize an** — neue Spielzeuge, Texturen, Geräusche
5. **Haben Sie Geduld** — der Sprung ist vorübergehend (1-6 Wochen)
6. **Vergleichen Sie nicht** — jedes Baby hat sein eigenes Tempo

## Wann Sie sich Sorgen machen sollten

Suchen Sie den Kinderarzt auf, wenn das Baby:
- Mit 4 Monaten den Kopf nicht hält
- Mit 9 Monaten nicht ohne Unterstützung sitzt
- Keinen Blickkontakt herstellt
- Nicht auf Geräusche reagiert
- Fähigkeiten verloren hat, die es bereits hatte (Regression)

---

**Quelle:** Brasilianische Gesellschaft für Pädiatrie (SBP), "The Wonder Weeks" (Van de Rijt & Plooij) und AAP.`,
  },
  {
    slug: "neugeborenes-baden",
    title: "Baden des Neugeborenen: sichere und vollständige Schritt-für-Schritt-Anleitung",
    excerpt: "Vollständige Schritt-für-Schritt-Anleitung, um das Neugeborene sicher und mit Vertrauen zu baden.",
    readTime: "6 Min Lesezeit",
    metaTitle: "Baden des Neugeborenen: sichere und vollständige Schritt-für-Schritt-Anleitung | Wilbor",
    metaDescription: "Vollständige Schritt-für-Schritt-Anleitung, um das Neugeborene sicher und mit Vertrauen zu baden.",
    keywords: ["Neugeborenes Baden", "erstes Bad Baby", "Nabelstumpf Pflege"],
    content: `## Das erste Bad: wann und wie

Das erste Bad des Neugeborenen löst oft viel Angst aus. Die **SBP** empfiehlt, dass das erste Bad **nach der Stabilisierung des Babys** erfolgt, in der Regel innerhalb der ersten 24 Lebensstunden.

## Vorbereitung: alles VORHER bereitlegen

Bevor Sie dem Baby die Kleidung ausziehen, legen Sie alles in Reichweite bereit:

- **Badewanne** mit lauwarmem Wasser (36-37°C)
- **Weiches Handtuch** mit Kapuze
- **Saubere Windel**
- **Saubere Kleidung**
- **Milde Flüssigseife** (speziell für Babys)
- **Watte** oder Gaze für das Gesicht
- **Badethermometer** (optional, aber empfohlen)

**Goldene Regel:** Lassen Sie das Baby NIEMALS allein in der Badewanne, nicht einmal für 1 Sekunde.

## Schritt für Schritt beim Baden

### 1. Wassertemperatur
- **Ideal:** 36°C bis 37°C
- **So testen Sie:** Tauchen Sie den Ellenbogen ein — es sollte lauwarm und angenehm sein
- **Wasserstand:** ausreichend, um die Schultern des Babys zu bedecken, wenn es sitzt

### 2. Umgebung
- **Raumtemperatur:** zwischen 22°C und 26°C
- **Keine Zugluft** — schließen Sie Fenster und Türen
- **Zeitpunkt:** vorzugsweise vor dem Stillen/Füttern (nicht direkt danach)

### 3. Sicheres Halten
- Stützen Sie den Kopf und den Nacken des Babys auf Ihrem Unterarm
- Halten Sie es mit der Hand sicher unter der Achsel
- Die andere Hand bleibt zum Waschen frei
- **Lassen Sie niemals los** — Babys sind nass sehr rutschig

### 4. Reihenfolge des Waschens
1. **Gesicht** — mit Watte oder feuchtem Tuch (ohne Seife)
2. **Kopf** — mit wenig Seife, sanft massieren
3. **Körper** — Hals, Arme, Hände, Rumpf
4. **Hautfalten** — Hals, Achseln, Leiste (wo sich Schmutz ansammelt)
5. **Genitalbereich** — zuletzt (bei Mädchen: immer von vorne nach hinten)
6. **Rücken** — drehen Sie das Baby vorsichtig um

### 5. Dauer
- **5 bis 10 Minuten** sind ausreichend
- Lange Bäder kühlen das Wasser ab und trocknen die Haut aus

### 6. Nach dem Bad
- Wickeln Sie das Baby sofort in das Handtuch
- Trocknen Sie die **Hautfalten** gut ab (Hals, Achseln, Leiste, hinter den Ohren)
- Trocknen Sie den **Nabelstumpf** mit sauberer Gaze
- Ziehen Sie es schnell an, damit es nicht auskühlt

## Pflege des Nabelstumpfs

- **Reinigung:** nach dem Bad und bei jedem Windelwechsel mit sauberer Gaze trocknen
- **Nicht verwenden:** 70% Alkohol, Quecksilber, Salben oder Verbände
- **Windel:** nach unten umschlagen, damit der Nabelstumpf an der Luft bleibt
- **Abfallen:** zwischen 7 und 21 Tagen (etwas Blut kann normal sein)
- **Suchen Sie den Kinderarzt auf, wenn:** Rötung rundherum, übel riechendes Sekret, Schwellung

## Empfohlene Produkte

- **Seife:** flüssig, mild, ohne starken Duft (pH 5,5)
- **Shampoo:** erst ab 2-3 Monaten (vorher die Seife verwenden)
- **Feuchtigkeitscreme:** nur bei trockener Haut und nach Empfehlung des Kinderarztes
- **Vermeiden Sie:** Puder, Eau de Cologne, Feuchttücher mit Alkohol

## Ofurô-Bad (Eimer)

Das Ofurô-Bad simuliert die Umgebung im Mutterleib und kann unruhige Babys beruhigen:

- Verwenden Sie einen speziellen Babyeimer
- Wasser mit derselben Temperatur (36-37°C)
- Das Baby bleibt bis zu den Schultern eingetaucht, in Fötusstellung
- Sehr gut für Babys mit Koliken
- **Immer unter Aufsicht** — halten Sie das Baby die ganze Zeit fest

## Zusätzliche Tipps

- **Abendliches Baden** kann bei der Schlafroutine helfen
- **Massage nach dem Bad** entspannt und stärkt die Bindung
- **Häufigkeit:** 1x pro Tag ist ausreichend (zu häufig trocknet die Haut aus)
- **Temperatur:** niemals schätzen — immer mit dem Ellenbogen testen

---

**Quelle:** Brasilianische Gesellschaft für Pädiatrie (SBP).`,
  },
  {
    slug: "algorithmus-schlafvorhersage-baby",
    title: "Der Algorithmus, der vorhersagt, wann Ihr Baby schlafen wird (und warum das alles verändert)",
    excerpt: "Entdecken Sie, wie Wilbor künstliche Intelligenz nutzt, um das nächste Nickerchen Ihres Babys präzise vorherzusagen, indem reale Daten mit medizinischen Protokollen kombiniert werden.",
    readTime: "5 Min Lesezeit",
    metaTitle: "Der Algorithmus, der vorhersagt, wann Ihr Baby schlafen wird (und warum das alles verändert) | Wilbor",
    metaDescription: "Entdecken Sie, wie Wilbor künstliche Intelligenz nutzt, um das nächste Nickerchen Ihres Babys präzise vorherzusagen, indem reale Daten mit medizinischen Pr",
    keywords: ["Wilbor Schlaf", "Schlafvorhersage Baby", "KI Baby Schlaf"],
    content: `## Der Algorithmus, der vorhersagt, wann Ihr Baby schlafen wird

Stellen Sie sich vor, Sie wüssten ganz genau, dass Ihr Baby um 14:37 Uhr schlafen muss. Nicht durch Intuition — sondern durch Wissenschaft. Das ist eine der exklusivsten Funktionen von Wilbor: die **Intelligente Nickerchen-Vorhersage**.

## Wie es funktioniert

Wilbor kombiniert zwei Datenquellen in Echtzeit:

### 1. Medizinische Tabelle der Wachfenster
Basierend auf dem exakten Alter des Babys in Wochen:
- **0–6 Wochen:** Das Baby hält nur 45–60 Min wach aus
- **3–4 Monate:** Das Wachfenster wächst auf 75–90 Min
- **6 Monate:** Es schafft bereits 2–2,5 Stunden zwischen den Nickerchen

### 2. Reale Historie Ihres Babys
Wilbor erfasst jedes Nickerchen, das Sie eintragen. Mit der Zeit lernt es die einzigartigen Muster Ihres Kindes.

## Die Formel

Das System kombiniert beide Quellen:

**Vorhersage = (60% × reale Daten des Babys) + (40% × medizinische Altersreferenz)**

Je mehr Daten Sie erfassen, desto personalisierter und genauer wird die Vorhersage.

## Warum das alles verändert

Früher versuchten Mütter, die Zeit des Nickerchens zu erraten — und lagen falsch. Mit der intelligenten Vorhersage:
- **Weniger Weinen** — Sie handeln, bevor extreme Müdigkeit einsetzt
- **Vorhersehbarere Routine** — Sie planen Ihren Tag mit Sicherheit
- **Tieferer Schlaf** — das Baby schläft im richtigen Zeitfenster, nicht erst danach

---
**Basierend auf:** Wachfenster-Protokoll der AAP und neonatalen Schlafdaten der SBP.`,
  },
  {
    slug: "ki-liest-zwischen-den-zeilen",
    title: "Die KI, die zwischen den Zeilen liest: Wie Wilbor versteht, was Sie nicht gesagt haben",
    excerpt: "Wilbor verfügt über ein emotionales Analysesystem, das Erschöpfung, Angst und Anzeichen von Überlastung in den Nachrichten von Müttern erkennt — selbst wenn sie nicht direkt um Hilfe bitten.",
    readTime: "5 Min Lesezeit",
    metaTitle: "Die KI, die zwischen den Zeilen liest: Wie Wilbor versteht, was Sie nicht gesagt haben | Wilbor",
    metaDescription: "Wilbor verfügt über ein emotionales Analysesystem, das Erschöpfung, Angst und Anzeichen von Überlastung in den Nachrichten von Müttern erkennt — selbst wen",
    keywords: ["Wilbor KI", "Erschöpfung Mutter", "emotionale Unterstützung Mutter"],
    content: `## Die KI, die zwischen den Zeilen liest

Eine Mutter schreibt: „mein Baby hört nicht auf zu weinen und ich weiß nicht mehr, was ich tun soll.“

Jeder gewöhnliche Assistent würde über Koliken oder Schlaf sprechen. Wilbor macht etwas anderes: **es liest zwischen den Zeilen**.

## Das System zum Lesen des emotionalen Kontexts

Wilbor verfügt über eine exklusive Funktion — ein Analysesystem, das im Hintergrund arbeitet, für die Mutter unsichtbar, aber in jedem Gespräch präsent.

### Was es erkennt

Während Wilbor über das Baby antwortet, analysiert das System die Nachricht und erkennt den **wirklichen Schmerz der Mutter** in Kategorien:

- **Extreme Erschöpfung** — „ich habe seit 3 Tagen nicht geschlafen“
- **Leistungsangst** — „mache ich das wirklich richtig?“
- **Emotionale Erschöpfung** — „ich habe nicht das Gefühl, eine gute Mutter zu sein“
- **Soziale Isolation** — „ich habe niemanden zum Reden“
- **Beziehungskonflikt** — „mein Mann hilft nicht“
- **Angst vor Verurteilung** — „ich schäme mich zu fragen“
- **Mütterliche Schuldgefühle** — „ich glaube, ich habe etwas falsch gemacht“
- **Mangelndes Vertrauen** — „ich weiß nicht, ob meine Milch ausreicht“

### Aufmerksamkeitsstufen

Für jedes erkannte Signal definiert das System eine Stufe: **Niedrig**, **Mittel**, **Hoch** oder **Kritisch**.

## Warum das wichtig ist

Mütterliche Erschöpfung betrifft viele Mütter weltweit — und die meisten bitten nicht um Hilfe, weil sie die eigenen Anzeichen nicht erkennen.

Wilbor diagnostiziert nicht. Aber es **nimmt wahr**, wenn etwas über das Weinen des Babys hinausgeht. Und es antwortet mit einer Empathie, die genau auf diesen Moment abgestimmt ist.

---
***Diese Funktion arbeitet ethisch und speichert keine sensiblen Daten über das für die Sitzung Notwendige hinaus.**`,
  },
  {
    slug: "wachstumsschube-beim-baby",
    title: "Wachstumsschübe beim Baby: Anzeichen und Wie Man Reagieren Sollte",
    excerpt: "Erkennen Sie die Anzeichen von Wachstumsschüben beim Baby und erfahren Sie, wie Sie geduldig auf Veränderungen im Alltag reagieren können.",
    readTime: "4 min",
    metaTitle: "Wachstumsschübe beim Baby: Anzeichen und Wie Man Reagieren Sollte | Wilbor-Assist",
    metaDescription: "Erkennen Sie die Anzeichen von Wachstumsschüben beim Baby und erfahren Sie, wie Sie geduldig auf Veränderungen im Alltag reagieren können. Basierend auf den Protokollen der DGKJ und der AAP.",
    keywords: ["Wachstumsschub Baby", "Baby unruhig", "Babyentwicklung", "Baby mehr Hunger", "Baby weint viel"],
    content: `## Was ist ein Wachstumsschub?\n\nWachstumsschübe sind Phasen beschleunigter körperlicher Entwicklung, die jedes Baby im ersten Lebensjahr erlebt. Diese Phasen können den etablierten Alltag durcheinanderbringen, aber das Erkennen der Anzeichen hilft dabei, ruhig und sicher zu reagieren.\n\n## Häufige Anzeichen eines Wachstumsschubs\n\n- **Mehr Hunger** \u2014 trinkt häufiger als gewöhnlich\n- **Veränderter Schlaf** \u2014 wacht nachts öfter auf\n- **Reizbarkeit** \u2014 weint mehr als sonst\n- **Starkes Nähebedürfnis** \u2014 möchte ständig auf den Arm\n\n## Wann treten sie auf?\n\nWachstumsschübe treten typischerweise auf mit: **7\u201310 Tagen**, **2\u20133 Wochen**, **4\u20136 Wochen**, **3 Monaten**, **6 Monaten** und **9 Monaten**.\n\n## Wie sollte man reagieren?\n\nFolgen Sie dem Rhythmus Ihres Babys. Bieten Sie mehr Mahlzeiten an, wenn es Anzeichen von Hunger zeigt, und geben Sie viel Nähe und Geborgenheit. Wachstumsschübe dauern im Durchschnitt **2 bis 3 Tage**. Für eine persönliche Orientierung können Sie Wilbor jederzeit konsultieren.\n\n---\n**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "neugeborenengelbsucht-ursachen-und-behandlung",
    title: "Neugeborenengelbsucht: Ursachen, Symptome und Behandlung",
    excerpt: "Verstehen Sie, was Neugeborenengelbsucht ist, warum sie auftritt, wann Sie einen Arzt aufsuchen sollten und wie die Behandlung erfolgt.",
    readTime: "5 min",
    metaTitle: "Neugeborenengelbsucht: Ursachen, Symptome und Behandlung | Wilbor-Assist",
    metaDescription: "Verstehen Sie, was Neugeborenengelbsucht ist, warum sie auftritt, wann Sie einen Arzt aufsuchen sollten und wie die Behandlung erfolgt. Basierend auf den Protokollen der DGKJ und der AAP.",
    keywords: ["Neugeborenengelbsucht", "Baby gelb", "Bilirubin Baby", "Gelbsucht Neugeborenes", "Phototherapie Baby"],
    content: `## Was ist Neugeborenengelbsucht?\n\nNeugeborenengelbsucht ist eine **sehr häufige** Erkrankung, die durch eine Gelbfärbung der Haut und des weißen Teils der Augen des Neugeborenen gekennzeichnet ist. Sie tritt auf, wenn sich zu viel **Bilirubin** im Blut des Babys befindet.\n\n## Warum tritt sie auf?\n\nDa die Leber des Neugeborenen noch in Entwicklung ist, kann sie das Bilirubin möglicherweise nicht schnell genug verarbeiten. Die meisten Fälle sind **mild und verschwinden von selbst** innerhalb von 1 bis 2 Wochen, während die Leber weiter reift.\n\n## Wann sollte man einen Arzt aufsuchen?\n\nSuchen Sie ärztliche Hilfe auf, wenn:\n\n- die Gelbsucht **in den ersten 24 Lebensstunden** auftritt\n- sich die gelbe Färbung **verstärkt oder ausbreitet**\n- das Baby **sehr schläfrig** ist oder sich schwer wecken lässt\n\n## Behandlung\n\nWenn die Bilirubinwerte erhöht sind, kann der Arzt eine **Phototherapie** empfehlen \u2014 das Baby wird unter spezielle blaue Lichter gelegt, die helfen, das Bilirubin abzubauen. Schwere Fälle sind selten.\n\n**Häufiges Füttern** (Muttermilch oder Säuglingsnahrung) hilft dem Baby, das Bilirubin über den Stuhl auszuscheiden.\n\n---\n**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "zahnen-beim-baby-symptome-und-linderung",
    title: "Zahnen beim Baby: Symptome und Wie Man das Unwohlsein Lindert",
    excerpt: "Bekommt Ihr Baby Zähne? Lernen Sie die Symptome kennen und entdecken Sie sichere Wege, das Unwohlsein im Zahnfleisch zu lindern.",
    readTime: "4 min",
    metaTitle: "Zahnen beim Baby: Symptome und Wie Man das Unwohlsein Lindert | Wilbor-Assist",
    metaDescription: "Bekommt Ihr Baby Zähne? Lernen Sie die häufigsten Symptome kennen und entdecken Sie sichere und wirksame Wege, das Unwohlsein im Zahnfleisch zu lindern. Basierend auf der DGKJ und der AAP.",
    keywords: ["Zahnen Baby", "Baby zahnt", "Zahnfleisch Baby", "erster Zahn Baby", "Beißring Baby"],
    content: `## Wann beginnt das Zahnen?\n\nDas Zahnen ist ein wichtiger Meilenstein im ersten Lebensjahr des Babys. Die meisten Babys bekommen den **ersten Zahn etwa mit 6 Monaten**, auch wenn dieser Zeitraum stark variieren kann.\n\n## Häufige Anzeichen des Zahnens\n\n- **Starker Speichelfluss**\n- **Beißt häufig auf Gegenständen** herum\n- **Reizbarkeit** und Unruhe\n- **Geschwollenes und empfindliches Zahnfleisch**\n- Leichter Anstieg der Körpertemperatur (kein Fieber)\n\n> Fieber über **38\u00b0C** wird NICHT durch das Zahnen verursacht und sollte vom Kinderarzt beurteilt werden.\n\n## Sichere Möglichkeiten zur Linderung des Unwohlseins\n\n- **Gekühlter Beißring** (nicht eingefroren) zum Kauen\n- **Kaltes feuchtes Tuch** zur Massage des Zahnfleischs\n- **Sanfte Massage mit dem Finger** am Zahnfleisch\n- Fragen Sie den Kinderarzt nach der Anwendung von **Paracetamol**, falls nötig\n\n\u26a0\ufe0f **Vermeiden Sie** Zahnungsgels mit **Benzocain** \u2014 sie können ernsthafte Risiken für die Gesundheit des Babys darstellen.\n\n---\n**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "wochenbettangst-vs-wochenbettdepression-unterschiede",
    title: "Wochenbettangst vs. Wochenbettdepression: Unterschiede, die Jede Mutter Kennen Sollte",
    excerpt: "Verstehen Sie die Unterschiede zwischen Wochenbettangst und Wochenbettdepression und erfahren Sie, wann Sie professionelle Hilfe suchen sollten.",
    readTime: "6 min",
    metaTitle: "Wochenbettangst vs. Wochenbettdepression: Unterschiede | Wilbor-Assist",
    metaDescription: "Verstehen Sie die Unterschiede zwischen Wochenbettangst und Wochenbettdepression, erkennen Sie die Symptome und erfahren Sie, wann Sie professionelle Hilfe suchen sollten.",
    keywords: ["Wochenbettangst", "Wochenbettdepression", "psychische Gesundheit Mutter", "Baby Blues", "postpartale Störung"],
    content: `## Die Zeit nach der Geburt und die psychische Gesundheit\n\nDie Zeit nach der Geburt ist ein Abschnitt intensiver körperlicher und emotionaler Veränderungen. Obwohl viele Menschen den \u201eBaby Blues\u201c kennen, sind ernstere Störungen wie die **Wochenbettdepression (DPP)** und die **Wochenbettangst (APP)** häufig und werden oft missverstanden.\n\n## Wichtigste Unterschiede\n\n| | Wochenbettdepression (DPP) | Wochenbettangst (APP) |\n|---|---|---|\n| **Hauptgefühl** | Anhaltende Traurigkeit, Hoffnungslosigkeit | \u00dcbermäßige Sorge, Angst |\n| **Gedanken** | Negativ, leer | Beschleunigt, katastrophisierend |\n| **Körperliche Symptome** | Müdigkeit, Appetitveränderung | Herzrasen, Schwindel |\n| **Beziehung zum Baby** | Schwierigkeit, eine Bindung aufzubauen | \u00dcbermäßiger Beschützerinstinkt |\n\n## Wichtig: Beide sind behandelbar\n\nDPP und APP können gleichzeitig auftreten. Beide Zustände sind **sehr gut behandelbar** mit professioneller Begleitung \u2014 Psychotherapie, Medikamente oder Selbsthilfegruppen.\n\nDiese Gefühle zu erleben **macht Sie nicht zu einer schlechten Mutter**. Es ist ein gesundheitlicher Zustand, der Fürsorge verdient.\n\n---\n**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und Weltgesundheitsorganisation (WHO).`,
  },
  {
    slug: "warum-wilbor-niemals-medikamente-verschreibt",
    title: "Warum Wilbor niemals Medikamente verschreibt (und warum das Ihre größte Sicherheit ist)",
    metaTitle: "Warum Wilbor keine Medikamente verschreibt | Wilbor-Assist",
    metaDescription: "Verstehen Sie, wie das 6-Block-Sicherheitsprotokoll von Wilbor funktioniert und warum eine ethische KI niemals Dosen berechnen oder Medikamente für Babys verschreiben sollte.",
    readTime: "5 min",
    excerpt: "Entdecken Sie, wie Wilbor ein klinisches 6-Block-Protokoll verwendet, um Mütter bei Medikamenten mit absoluter Sicherheit anzuleiten, ohne jemals den Kinderarzt zu ersetzen.",
    keywords: ["KI-Verschreibung", "Babysicherheit", "medizinisches Protokoll", "Babymedikamente", "Wilbor Sicherheit"],
    content: `## Der schmale Grat zwischen Hilfe und Risiko\n\nWenn das Baby mitten in der Nacht mit Fieber weint, ist der erste Instinkt jeder Mutter, schnelle Linderung zu suchen. Im Zeitalter der künstlichen Intelligenz ist es verlockend, einen Chat zu fragen: *"Wie viele Tropfen Paracetamol gebe ich meinem 8 kg schweren Baby?"*\n\nViele generische KIs würden diese Frage mit einer mathematischen Berechnung beantworten. **Wilbor tut das nicht.** Und dafür gibt es einen sehr ernsten Grund.\n\n## Das 6-Block-Protokoll von Wilbor\n\nWilbor wurde mit einer nicht verhandelbaren Richtlinie trainiert: **Die Sicherheit Ihres Babys steht über jeder technologischen Bequemlichkeit.**\n\nWenn Sie nach Medikamenten fragen, aktiviert Wilbor ein strenges klinisches 6-Stufen-Protokoll:\n\n1. **Empathie:** Er versteht Ihre Not und validiert Ihre Sorge.\n2. **Neutrale Information:** Erklärt, wofür das erwähnte Medikament dient, ohne dessen Verwendung zu fördern.\n3. **Aufklärung über Dosierung:** Erklärt, dass die Dosis von Gewicht und Konzentration abhängt, aber **führt niemals die Berechnung durch**.\n4. **Sichere Anleitung:** Erinnert an die Wichtigkeit, die Dosis mit dem Kinderarzt zu bestätigen.\n5. **Klinische Triage:** Stellt wesentliche Fragen (Wie lange? Wie hoch ist die Temperatur? Gibt es andere Symptome?).\n6. **Warnzeichen:** Gibt genau an, wann die Situation keine häusliche Pflege mehr ist und zu einem Notfall für die Notaufnahme wird.\n\n## Warum ist das Ihre größte Sicherheit?\n\nEin Berechnungsfehler im Milligrammbereich kann bei einem Baby zu einer schweren Vergiftung führen. Eine KI kann weder die genaue Konzentration der Flasche sehen, die Sie zu Hause haben, noch den Allgemeinzustand des Kindes beurteilen.\n\nWilbor fungiert als Ihr **intelligentestes und sicherstes Unterstützungsnetzwerk**. Er organisiert Informationen, beruhigt Ihr Herz, sagt Ihnen, worauf Sie achten müssen und wann Sie ins Krankenhaus eilen sollten. Er stärkt Sie mit Wissen, überschreitet aber niemals die Grenze der medizinischen Verantwortung.\n\nDenn sich wirklich zu kümmern bedeutet, genau zu wissen, wie weit man gehen darf.\n\n---\n**Quelle:** Sicherheitsprotokolle für digitale Gesundheit und Richtlinien der Deutschen Gesellschaft für Kinder- und Jugendmedizin (DGKJ).`,
  },
];
// ==========================================
// FRENCH ARTICLES (FR) \u2014 Articles 13-16
// ==========================================
export const blogArticlesFR_new: BlogArticleTranslation[] = [
  {
    slug: "poussees-de-croissance-du-bebe",
    title: "Poussées de Croissance du Bébé : Signes et Comment Réagir",
    excerpt: "Reconnaissez les signes des poussées de croissance du bébé et apprenez à répondre avec patience aux changements de routine.",
    readTime: "4 min",
    metaTitle: "Poussées de Croissance du Bébé : Signes et Comment Réagir | Wilbor-Assist",
    metaDescription: "Reconnaissez les signes des poussées de croissance du bébé et apprenez à répondre avec patience aux changements de routine. Basé sur les protocoles de la SFP et de l'AAP.",
    keywords: ["poussée de croissance bébé", "bébé agité", "développement infantile", "bébé plus faim", "bébé pleureur"],
    content: `## Qu'est-ce qu'une poussée de croissance ?

Les poussées de croissance sont des périodes de développement physique accéléré que chaque bébé traverse durant sa première année de vie. Ces phases peuvent perturber la routine établie, mais reconnaître les signes permet de réagir avec calme et sécurité.

## Signes courants d'une poussée de croissance

- **Plus de faim** — tète plus fréquemment que d'habitude
- **Sommeil perturbé** — se réveille plus souvent la nuit
- **Irritabilité** — pleure plus que la normale
- **Besoin de proximité** — veut être porté en permanence

## Quand cela se produit-il ?

Les poussées de croissance surviennent généralement à : **7–10 jours**, **2–3 semaines**, **4–6 semaines**, **3 mois**, **6 mois** et **9 mois**.

## Comment agir

Suivez le rythme de votre bébé. Offrez plus de tétées lorsqu'il montre des signes de faim et apportez beaucoup de contact et de réconfort. Les poussées de croissance durent en moyenne **2 à 3 jours**. Pour un accompagnement personnalisé, consultez Wilbor à tout moment.

---
**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "ictere-neonatal-causes-et-traitement",
    title: "Ictère Néonatal : Causes, Symptômes et Traitement",
    excerpt: "Comprenez ce qu'est l'ictère néonatal, pourquoi il apparaît, quand consulter un médecin et comment il est traité.",
    readTime: "5 min",
    metaTitle: "Ictère Néonatal : Causes, Symptômes et Traitement | Wilbor-Assist",
    metaDescription: "Comprenez ce qu'est l'ictère néonatal, pourquoi il apparaît, quand consulter un médecin et comment il est traité. Basé sur les protocoles de la SFP et de l'AAP.",
    keywords: ["ictère néonatal", "bébé jaune", "bilirubine bébé", "ictère nouveau-né", "photothérapie bébé"],
    content: `## Qu'est-ce que l'ictère néonatal ?

L'ictère néonatal est une condition **très fréquente** caractérisée par un jaunissement de la peau et du blanc des yeux du nouveau-né. Elle survient lorsqu'il y a un excès de **bilirubine** dans le sang du bébé.

## Pourquoi cela se produit-il ?

Comme le foie du nouveau-né est encore en développement, il peut ne pas traiter la bilirubine suffisamment rapidement. La majorité des cas est **légère et se résout spontanément** en 1 à 2 semaines, à mesure que le foie mûrit.

## Quand consulter un médecin

Consultez un professionnel de santé si :

- L'ictère **apparaît dans les premières 24 heures** de vie
- La coloration jaune **s'intensifie ou s'étend**
- Le bébé est **très somnolent** ou difficile à réveiller

## Traitement

Lorsque les niveaux de bilirubine sont élevés, le médecin peut recommander une **photothérapie** — le bébé est placé sous des lumières bleues spéciales qui aident à décomposer la bilirubine. Les cas graves sont rares.

**Des tétées fréquentes** (lait maternel ou formule) aident le bébé à éliminer la bilirubine par les selles.

---
**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "dentition-du-bebe-symptomes-et-soulagement",
    title: "Dentition du Bébé : Symptômes et Comment Soulager l'Inconfort",
    excerpt: "Votre bébé fait ses dents ? Découvrez les symptômes et des moyens sûrs de soulager l'inconfort des gencives.",
    readTime: "4 min",
    metaTitle: "Dentition du Bébé : Symptômes et Comment Soulager | Wilbor-Assist",
    metaDescription: "Votre bébé fait ses dents ? Découvrez les symptômes courants et les moyens sûrs et efficaces de soulager l'inconfort des gencives. Basé sur la SFP et l'AAP.",
    keywords: ["dentition bébé", "bébé qui fait ses dents", "gencives bébé", "première dent bébé", "anneau de dentition"],
    content: `## Quand commence la dentition ?

La dentition est une étape importante de la première année du bébé. La plupart des bébés ont leur **première dent vers 6 mois**, bien que cette période puisse varier considérablement.

## Signes courants de la dentition

- **Salivation excessive**
- **Mord des objets** fréquemment
- **Irritabilité** et agitation
- **Gencives gonflées et sensibles**
- Légère augmentation de la température corporelle (ce n'est pas de la fièvre)

> Une fièvre supérieure à **38°C** N'EST PAS causée par la dentition et doit être évaluée par un pédiatre.

## Moyens sûrs de soulager l'inconfort

- **Anneau de dentition réfrigéré** (non congelé)
- **Linge humide froid** pour masser les gencives
- **Massage doux avec le doigt** sur les gencives
- Consultez le pédiatre concernant l'utilisation de **paracétamol** si nécessaire

⚠️ **Évitez** les gels de dentition contenant de la **benzocaïne** — ils peuvent présenter des risques sérieux pour la santé du bébé.

---
**Source :** Société Française de Pédiatrie (SFP) et American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "anxiete-post-partum-vs-depression-differences",
    title: "Anxiété Post-Partum vs Dépression Post-Partum : Différences Essentielles",
    excerpt: "Comprenez les différences entre l'anxiété post-partum et la dépression post-partum, et sachez quand consulter un professionnel.",
    readTime: "6 min",
    metaTitle: "Anxiété Post-Partum vs Dépression Post-Partum : Différences | Wilbor-Assist",
    metaDescription: "Comprenez les différences entre l'anxiété post-partum et la dépression post-partum, reconnaissez les symptômes et sachez quand consulter un professionnel.",
    keywords: ["anxiété post-partum", "dépression post-partum", "santé mentale maternelle", "baby blues", "trouble post-partum"],
    content: `## La période post-partum et la santé mentale

La période post-partum est un moment de transformations physiques et émotionnelles intenses. Bien que beaucoup connaissent le "baby blues", des troubles plus sérieux comme la **Dépression Post-Partum (DPP)** et l'**Anxiété Post-Partum (APP)** sont fréquents et souvent mal compris.

## Principales différences

| | Dépression Post-Partum (DPP) | Anxiété Post-Partum (APP) |
|---|---|---|
| **Sentiment principal** | Tristesse persistante, désespoir | Inquiétude excessive, peur |
| **Pensées** | Négatives, vides | Rapides, catastrophiques |
| **Symptômes physiques** | Fatigue, changement d'appétit | Cœur accéléré, étourdissements |
| **Relation avec le bébé** | Difficulté à créer un lien | Surprotection excessive |

## Important : les deux se traitent

La DPP et l'APP peuvent survenir en même temps. Les deux conditions sont **hautement traitables** avec un accompagnement professionnel — psychothérapie, médication ou groupes de soutien.

Ressentir cela **ne fait pas de vous une mauvaise mère**. C'est une condition de santé qui mérite de l'attention. Si vous ou quelqu'un que vous connaissez traverse cela, consulter un professionnel de santé est la première étape.

---
**Source :** Société Française de Pédiatrie (SFP) et Organisation Mondiale de la Santé (OMS).`,
  },
  {
    slug: "pourquoi-wilbor-ne-prescrit-jamais-de-medicaments",
    title: "Pourquoi Wilbor ne prescrit jamais de médicaments (et pourquoi c'est votre plus grande sécurité)",
    metaTitle: "Pourquoi Wilbor ne prescrit pas de médicaments | Wilbor-Assist",
    metaDescription: "Comprenez comment fonctionne le protocole de sécurité en 6 blocs de Wilbor et pourquoi une IA éthique ne devrait jamais calculer de doses ou prescrire des médicaments pour les bébés.",
    readTime: "5 min",
    excerpt: "Découvrez comment Wilbor utilise un protocole clinique en 6 blocs pour guider les mères sur les médicaments en toute sécurité, sans jamais remplacer le pédiatre.",
    keywords: ["prescription IA", "sécurité bébé", "protocole médical", "médicament bébé", "Wilbor sécurité"],
    content: `## La Fine Ligne Entre Aide et Risque\n\nQuand le bébé pleure au milieu de la nuit avec de la fièvre, le premier instinct de toute mère est de chercher un soulagement rapide. À l'ère de l'intelligence artificielle, il est tentant de demander à un chat : *"Combien de gouttes de paracétamol dois-je donner à mon bébé de 8 kg ?"*\n\nDe nombreuses IA génériques répondraient à cette question par un calcul mathématique. **Wilbor ne le fait pas.** Et il y a une raison très sérieuse à cela.\n\n## Le Protocole en 6 Blocs de Wilbor\n\nWilbor a été formé avec une directive non négociable : **la sécurité de votre bébé est au-dessus de toute commodité technologique.**\n\nLorsque vous posez des questions sur les médicaments, Wilbor active un protocole clinique rigoureux en 6 étapes :\n\n1. **Empathie :** Il comprend votre détresse et valide votre inquiétude.\n2. **Information Neutre :** Explique à quoi sert le médicament mentionné, sans encourager son utilisation.\n3. **Éducation sur le Dosage :** Explique que la dose dépend du poids et de la concentration, mais **ne fait jamais le calcul**.\n4. **Orientation Sûre :** Rappelle l'importance de confirmer la dose avec le pédiatre.\n5. **Triage Clinique :** Pose des questions essentielles (Depuis combien de temps ? Quelle est la température ? Y a-t-il d'autres symptômes ?).\n6. **Signes d'Alerte :** Indique exactement quand la situation cesse d'être un soin à domicile et devient une urgence hospitalière.\n\n## Pourquoi Est-ce Votre Plus Grande Sécurité ?\n\nUne erreur de calcul en milligrammes peut provoquer une intoxication grave chez un bébé. Une IA ne peut pas voir la concentration exacte du flacon que vous avez à la maison, ni évaluer l'état général de l'enfant.\n\nWilbor agit comme votre **réseau de soutien le plus intelligent et le plus sûr**. Il organise les informations, apaise votre cœur, vous dit quoi observer et quand courir à l'hôpital. Il vous donne les moyens d'agir grâce à la connaissance, mais ne franchit jamais la ligne de la responsabilité médicale.\n\nParce que prendre vraiment soin, c'est savoir exactement jusqu'où aller.\n\n---\n**Source :** Protocoles de Sécurité en Santé Numérique et Directives de la Société Française de Pédiatrie (SFP).`,
  },
];

// ==========================================
// GERMAN ARTICLES (DE) — Articles 13-16
// ==========================================
export const blogArticlesDE_new: BlogArticleTranslation[] = [
  {
    slug: "wachstumsschube-beim-baby",
    title: "Wachstumsschübe beim Baby: Anzeichen und Wie Man Reagieren Sollte",
    excerpt: "Erkennen Sie die Anzeichen von Wachstumsschüben beim Baby und erfahren Sie, wie Sie geduldig auf Veränderungen im Alltag reagieren können.",
    readTime: "4 min",
    metaTitle: "Wachstumsschübe beim Baby: Anzeichen und Wie Man Reagieren Sollte | Wilbor-Assist",
    metaDescription: "Erkennen Sie die Anzeichen von Wachstumsschüben beim Baby und erfahren Sie, wie Sie geduldig auf Veränderungen im Alltag reagieren können. Basierend auf den Protokollen der DGKJ und der AAP.",
    keywords: ["Wachstumsschub Baby", "Baby unruhig", "Babyentwicklung", "Baby mehr Hunger", "Baby weint viel"],
    content: `## Was ist ein Wachstumsschub?

Wachstumsschübe sind Phasen beschleunigter körperlicher Entwicklung, die jedes Baby im ersten Lebensjahr erlebt. Diese Phasen können den etablierten Alltag durcheinanderbringen, aber das Erkennen der Anzeichen hilft dabei, ruhig und sicher zu reagieren.

## Häufige Anzeichen eines Wachstumsschubs

- **Mehr Hunger** — trinkt häufiger als gewöhnlich
- **Veränderter Schlaf** — wacht nachts öfter auf
- **Reizbarkeit** — weint mehr als sonst
- **Starkes Nähebedürfnis** — möchte ständig auf den Arm

## Wann treten sie auf?

Wachstumsschübe treten typischerweise auf mit: **7–10 Tagen**, **2–3 Wochen**, **4–6 Wochen**, **3 Monaten**, **6 Monaten** und **9 Monaten**.

## Wie sollte man reagieren?

Folgen Sie dem Rhythmus Ihres Babys. Bieten Sie mehr Mahlzeiten an, wenn es Anzeichen von Hunger zeigt, und geben Sie viel Nähe und Geborgenheit. Wachstumsschübe dauern im Durchschnitt **2 bis 3 Tage**. Für eine persönliche Orientierung können Sie Wilbor jederzeit konsultieren.

---
**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "neugeborenengelbsucht-ursachen-und-behandlung",
    title: "Neugeborenengelbsucht: Ursachen, Symptome und Behandlung",
    excerpt: "Verstehen Sie, was Neugeborenengelbsucht ist, warum sie auftritt, wann Sie einen Arzt aufsuchen sollten und wie die Behandlung erfolgt.",
    readTime: "5 min",
    metaTitle: "Neugeborenengelbsucht: Ursachen, Symptome und Behandlung | Wilbor-Assist",
    metaDescription: "Verstehen Sie, was Neugeborenengelbsucht ist, warum sie auftritt, wann Sie einen Arzt aufsuchen sollten und wie die Behandlung erfolgt. Basierend auf den Protokollen der DGKJ und der AAP.",
    keywords: ["Neugeborenengelbsucht", "Baby gelb", "Bilirubin Baby", "Gelbsucht Neugeborenes", "Phototherapie Baby"],
    content: `## Was ist Neugeborenengelbsucht?

Neugeborenengelbsucht ist eine **sehr häufige** Erkrankung, die durch eine Gelbfärbung der Haut und des weißen Teils der Augen des Neugeborenen gekennzeichnet ist. Sie tritt auf, wenn sich zu viel **Bilirubin** im Blut des Babys befindet.

## Warum tritt sie auf?

Da die Leber des Neugeborenen noch in Entwicklung ist, kann sie das Bilirubin möglicherweise nicht schnell genug verarbeiten. Die meisten Fälle sind **mild und verschwinden von selbst** innerhalb von 1 bis 2 Wochen, während die Leber weiter reift.

## Wann sollte man einen Arzt aufsuchen?

Suchen Sie ärztliche Hilfe auf, wenn:

- die Gelbsucht **in den ersten 24 Lebensstunden** auftritt
- sich die gelbe Färbung **verstärkt oder ausbreitet**
- das Baby **sehr schläfrig** ist oder sich schwer wecken lässt

## Behandlung

Wenn die Bilirubinwerte erhöht sind, kann der Arzt eine **Phototherapie** empfehlen — das Baby wird unter spezielle blaue Lichter gelegt, die helfen, das Bilirubin abzubauen. Schwere Fälle sind selten.

**Häufiges Füttern** (Muttermilch oder Säuglingsnahrung) hilft dem Baby, das Bilirubin über den Stuhl auszuscheiden.

---
**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "zahnen-beim-baby-symptome-und-linderung",
    title: "Zahnen beim Baby: Symptome und Wie Man das Unwohlsein Lindert",
    excerpt: "Bekommt Ihr Baby Zähne? Lernen Sie die Symptome kennen und entdecken Sie sichere Wege, das Unwohlsein im Zahnfleisch zu lindern.",
    readTime: "4 min",
    metaTitle: "Zahnen beim Baby: Symptome und Wie Man das Unwohlsein Lindert | Wilbor-Assist",
    metaDescription: "Bekommt Ihr Baby Zähne? Lernen Sie die häufigsten Symptome kennen und entdecken Sie sichere und wirksame Wege, das Unwohlsein im Zahnfleisch zu lindern. Basierend auf der DGKJ und der AAP.",
    keywords: ["Zahnen Baby", "Baby zahnt", "Zahnfleisch Baby", "erster Zahn Baby", "Beißring Baby"],
    content: `## Wann beginnt das Zahnen?

Das Zahnen ist ein wichtiger Meilenstein im ersten Lebensjahr des Babys. Die meisten Babys bekommen den **ersten Zahn etwa mit 6 Monaten**, auch wenn dieser Zeitraum stark variieren kann.

## Häufige Anzeichen des Zahnens

- **Starker Speichelfluss**
- **Beißt häufig auf Gegenständen** herum
- **Reizbarkeit** und Unruhe
- **Geschwollenes und empfindliches Zahnfleisch**
- Leichter Anstieg der Körpertemperatur (kein Fieber)

> Fieber über **38°C** wird NICHT durch das Zahnen verursacht und sollte vom Kinderarzt beurteilt werden.

## Sichere Möglichkeiten zur Linderung des Unwohlseins

- **Gekühlter Beißring** (nicht eingefroren) zum Kauen
- **Kaltes feuchtes Tuch** zur Massage des Zahnfleischs
- **Sanfte Massage mit dem Finger** am Zahnfleisch
- Fragen Sie den Kinderarzt nach der Anwendung von **Paracetamol**, falls nötig

⚠️ **Vermeiden Sie** Zahnungsgels mit **Benzocain** — sie können ernsthafte Risiken für die Gesundheit des Babys darstellen.

---
**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "wochenbettangst-vs-wochenbettdepression-unterschiede",
    title: "Wochenbettangst vs. Wochenbettdepression: Unterschiede, die Jede Mutter Kennen Sollte",
    excerpt: "Verstehen Sie die Unterschiede zwischen Wochenbettangst und Wochenbettdepression und erfahren Sie, wann Sie professionelle Hilfe suchen sollten.",
    readTime: "6 min",
    metaTitle: "Wochenbettangst vs. Wochenbettdepression: Unterschiede | Wilbor-Assist",
    metaDescription: "Verstehen Sie die Unterschiede zwischen Wochenbettangst und Wochenbettdepression, erkennen Sie die Symptome und erfahren Sie, wann Sie professionelle Hilfe suchen sollten.",
    keywords: ["Wochenbettangst", "Wochenbettdepression", "psychische Gesundheit Mutter", "Baby Blues", "postpartale Störung"],
    content: `## Die Zeit nach der Geburt und die psychische Gesundheit

Die Zeit nach der Geburt ist ein Abschnitt intensiver körperlicher und emotionaler Veränderungen. Obwohl viele Menschen den „Baby Blues“ kennen, sind ernstere Störungen wie die **Wochenbettdepression (DPP)** und die **Wochenbettangst (APP)** häufig und werden oft missverstanden.

## Wichtigste Unterschiede

| | Wochenbettdepression (DPP) | Wochenbettangst (APP) |
|---|---|---|
| **Hauptgefühl** | Anhaltende Traurigkeit, Hoffnungslosigkeit | Übermäßige Sorge, Angst |
| **Gedanken** | Negativ, leer | Beschleunigt, katastrophisierend |
| **Körperliche Symptome** | Müdigkeit, Appetitveränderung | Herzrasen, Schwindel |
| **Beziehung zum Baby** | Schwierigkeit, eine Bindung aufzubauen | Übermäßiger Beschützerinstinkt |

## Wichtig: Beide sind behandelbar

DPP und APP können gleichzeitig auftreten. Beide Zustände sind **sehr gut behandelbar** mit professioneller Begleitung — Psychotherapie, Medikamente oder Selbsthilfegruppen.

Diese Gefühle zu erleben **macht Sie nicht zu einer schlechten Mutter**. Es ist ein gesundheitlicher Zustand, der Fürsorge verdient. Wenn Sie oder jemand, den Sie kennen, dies durchmacht, ist die Suche nach einem Gesundheitsfachmann der erste Schritt.

---
**Quelle:** Deutsche Gesellschaft für Kinder- und Jugendmedizin (DGKJ) und Weltgesundheitsorganisation (WHO).`,
  },
  {
    slug: "warum-wilbor-niemals-medikamente-verschreibt",
    title: "Warum Wilbor niemals Medikamente verschreibt (und warum das Ihre größte Sicherheit ist)",
    metaTitle: "Warum Wilbor keine Medikamente verschreibt | Wilbor-Assist",
    metaDescription: "Verstehen Sie, wie das 6-Block-Sicherheitsprotokoll von Wilbor funktioniert und warum eine ethische KI niemals Dosen berechnen oder Medikamente für Babys verschreiben sollte.",
    readTime: "5 min",
    excerpt: "Entdecken Sie, wie Wilbor ein klinisches 6-Block-Protokoll verwendet, um Mütter bei Medikamenten mit absoluter Sicherheit anzuleiten, ohne jemals den Kinderarzt zu ersetzen.",
    keywords: ["KI-Verschreibung", "Babysicherheit", "medizinisches Protokoll", "Babymedikamente", "Wilbor Sicherheit"],
    content: `## Der schmale Grat zwischen Hilfe und Risiko\n\nWenn das Baby mitten in der Nacht mit Fieber weint, ist der erste Instinkt jeder Mutter, schnelle Linderung zu suchen. Im Zeitalter der künstlichen Intelligenz ist es verlockend, einen Chat zu fragen: *"Wie viele Tropfen Paracetamol gebe ich meinem 8 kg schweren Baby?"*\n\nViele generische KIs würden diese Frage mit einer mathematischen Berechnung beantworten. **Wilbor tut das nicht.** Und dafür gibt es einen sehr ernsten Grund.\n\n## Das 6-Block-Protokoll von Wilbor\n\nWilbor wurde mit einer nicht verhandelbaren Richtlinie trainiert: **Die Sicherheit Ihres Babys steht über jeder technologischen Bequemlichkeit.**\n\nWenn Sie nach Medikamenten fragen, aktiviert Wilbor ein strenges klinisches 6-Stufen-Protokoll:\n\n1. **Empathie:** Er versteht Ihre Not und validiert Ihre Sorge.\n2. **Neutrale Information:** Erklärt, wofür das erwähnte Medikament dient, ohne dessen Verwendung zu fördern.\n3. **Aufklärung über Dosierung:** Erklärt, dass die Dosis von Gewicht und Konzentration abhängt, aber **führt niemals die Berechnung durch**.\n4. **Sichere Anleitung:** Erinnert an die Wichtigkeit, die Dosis mit dem Kinderarzt zu bestätigen.\n5. **Klinische Triage:** Stellt wesentliche Fragen (Wie lange? Wie hoch ist die Temperatur? Gibt es andere Symptome?).\n6. **Warnzeichen:** Gibt genau an, wann die Situation keine häusliche Pflege mehr ist und zu einem Notfall für die Notaufnahme wird.\n\n## Warum ist das Ihre größte Sicherheit?\n\nEin Berechnungsfehler im Milligrammbereich kann bei einem Baby zu einer schweren Vergiftung führen. Eine KI kann weder die genaue Konzentration der Flasche sehen, die Sie zu Hause haben, noch den Allgemeinzustand des Kindes beurteilen.\n\nWilbor fungiert als Ihr **intelligentestes und sicherstes Unterstützungsnetzwerk**. Er organisiert Informationen, beruhigt Ihr Herz, sagt Ihnen, worauf Sie achten müssen und wann Sie ins Krankenhaus eilen sollten. Er stärkt Sie mit Wissen, überschreitet aber niemals die Grenze der medizinischen Verantwortung.\n\nDenn sich wirklich zu kümmern bedeutet, genau zu wissen, wie weit man gehen darf.\n\n---\n**Quelle:** Sicherheitsprotokolle für digitale Gesundheit und Richtlinien der Deutschen Gesellschaft für Kinder- und Jugendmedizin (DGKJ).`,
  },
];