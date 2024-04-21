Sure, let's summarize all the requirements along with the necessary logic:

### Requirements:

1. **Generate Vacation Plans:**

   - Generate vacation plans based on the following criteria:
     - Duration of vacation (2, 3, 4, 5, 6, 7, 9, 12, 15 days or a full month).
     - Maximum travel time allowed.

2. **Evaluation Criteria:**

   - **Number of Holidays vs Vacation Days Ratio (Ratio Rating):**
     - More holidays within the vacation period should increase the rating.
   - **Travel Time Constraint (Travel Time Rating):**
     - Travel time should not exceed 1/4th of the overall vacation plan.
   - **More days to travel - more rest and relaxed it can be at the same time pricy (More Days Rating):**
     - A vacation with more days should be rated higher.
   - **Short and Sweet - Less vacation or no vacation at all - Budget Friendly (Short & Sweet Rating):**
     - A shorter vacation should be more budget-friendly.

3. **Overall Rating Calculation:**

   - Calculate the overall rating based on the individual ratings (Ratio Rating, Travel Time Rating, More Days Rating, Short & Sweet Rating).

4. **Tags:**

   - Tag the vacation plans based on their characteristics:
     - Economical, Pricy
     - Pleasant
     - Short, Medium, Long Duration

5. **Prevent Duplicate Holidays Included:**

   - Ensure that the same holiday is not included multiple times in a vacation plan.

6. **Response Format:**

   - Each vacation plan should include:
     - Itinerary details: from date, to date, travel time, rest date, site-seeing dates, and transport mode.
     - Holidays included.
     - Rating details: ratio rating, travel time rating, more days rating, short & sweet rating, overall rating.
     - Tags.
     - Best plan flag.

7. **UI Component:**
   - A card component to display the vacation plan with the above details.

### Logic:

1. **Vacation Plan Generation:**

   - Generate vacation plans of different durations based on maximum travel time allowed.
   - Ensure that the travel time does not exceed 1/4th of the overall vacation plan.
   - Generate short-term (2, 3, 4 days), medium-term (5, 6, 7 days), and long-term (9, 12, 15 days, full month) vacation plans.

2. **Rating Calculation:**

   - Calculate individual ratings based on the given criteria.
   - Calculate the overall rating based on individual ratings.
   - Tags are determined based on the duration of the vacation plan.

3. **Prevent Duplicate Holidays:**

   - Ensure that the same holiday is not included multiple times in a vacation plan.

4. **Response Format:**

   - Each vacation plan should be represented as an object containing:
     - Itinerary details.
     - Holidays included.
     - Rating details.
     - Tags.
     - Best plan flag.

5. **UI Component:**
   - Create a card component to display each vacation plan.
   - The card should include all the details of the vacation plan.

### TODO:
