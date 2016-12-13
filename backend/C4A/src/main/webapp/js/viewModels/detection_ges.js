define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout','ojs/ojmodule','ojs/ojmodel', 'ojs/ojchart', 'ojs/ojlegend', 'ojs/ojbutton',
    'ojs/ojmenu', 'ojs/ojpopup', 'ojs/ojinputtext', 'ojs/ojtoolbar', 'ojs/ojselectcombobox', 'ojs/ojslider',
    'ojs/ojradioset', 'ojs/ojdialog', 'ojs/ojlistview', 'ojs/ojarraytabledatasource', 'ojs/ojswitch', 'ojs/ojtabs', 'urls','entities'],
        function (oj, ko, $) {


            function detectionGesContentViewModel() {

                
                var self = this;
                
                 // Server interaction callbacks
                var loadSucessCallback = function (data) {
                    var countMonths = data.monthLabels.length;
                    var countGefs = data.gefLabels.length;

                    var nullfill=[];

                    var series = [];

                    groups = data.monthLabels;

                    for (i = 0; i < countGefs; i++) {
                        nullfill=[],j=0;for(;j<countMonths;)nullfill[j++]=null;
                        var s = new Serie();
                        s.name = data.gefLabels[i];
                        s.items = nullfill;
                        series[i] = s;
                    }

                    for (i = 0; i < series.length; i++) {
                        for (j = 0; j < groups.length; j++) {
                                for (k = 0; k < data.gefs.length; k++) {    	    			
                                         if((data.gefs[k].cdDetectionVariable.detectionVariableName == series[i].name) && (data.gefs[k].timeInterval.start == groups[j])) {
                                                var newItem = new Item();
                                                newItem.id = data.gefs[k].id;
                                                newItem.value = data.gefs[k].gefValue;
                                                series[i].items[j] = 	newItem;                	    					 
                                         } 
                                 }
                        }
                    }
                    
                    self.groupsValue(groups);
                    self.seriesValue(series);
                    
                    var chartPointsIds = [];
                    var pointIds = [];
                    for (var i = 0; i < series.length ;  i++) {
                        for (var j = 0; j < series[i].items.length;  j++) {
                            chartPointsIds.push( series[i].items[j]);
                            pointIds.push(series[i].items[j].id);
                        }
                    }
                    loadAssessments({geriatricFactorValueIds : pointIds});
                };
                
                var serverErrorCallback = function (xhr, message, error) {
                    console.log(error);
                };
                
                
                var loadDataSet = function(data) {
                    //TODO: remove hardcoded values when real data available
                    var jqXHR = $.postJSON(ASSESSMENTS_DIAGRAM_DATA,"{\"timestampStart\":\"2016-01-01 00:00:00\",\"timestampEnd\":\"2017-01-01 00:00:00\",\"crId\":1,\"dvParentId\":4}" , loadSucessCallback);
                    jqXHR.fail(serverErrorCallback);
                    return jqXHR;
                };
                
                var loadAnnotations = function (pointIds) {
                    var pointIdsJson = JSON.stringify({geriatricFactorValueIds : pointIds});
                    return $.postJSON(ASSESSMENTS_FOR_DATA_POINTS, pointIdsJson, function (assesments) {
                        var annotations = [];
                        for (var i = 0; i < assesments.length; i++) {
                            var assessment = assesments[i];
                            var annotation = new Annotation();
                            annotation.id = assessment.id;
                            annotation.comment = assessment.assessmentComment;
                            annotation.shortComment = shortenText(assessment.assessmentComment, 27);
                            annotation.from = assessment.userInRole.id;
                            annotation.dateAndTime = assessment.created;
                            annotation.type = assessment.riskStatus;
                            annotation.imgSrc = 'comment.png';
                            if('W'== annotation.type)
                                annotation.imgSrc = 'images/risk_warning.png';
                            else if('A'== annotation.type)
                                annotation.imgSrc = 'images/risk_alert.png';
                            annotations.push(annotation);
                        }
                        self.selectedAnotations(annotations);
                        self.dataPointsMarked(self.dataPointsMarked() + ' with ' + annotations.length + ' annotation(s)');
                    });
                };
                
                var loadCachedAnnotations = function (assessments) {
                        var annotations = [];
                        for (var i = 0; i < assessments.length; i++) {
                            var assessment = assessments[i];
                            var annotation = new Annotation();
                            annotation.id = assessment[0].id;
                            annotation.comment = assessment[0].assessmentComment;
                            annotation.shortComment = shortenText(assessment[0].assessmentComment, 27);
                            annotation.from = assessment[0].userInRole.id;
                            annotation.dateAndTime = assessment[0].created;
                            annotation.type = assessment[0].riskStatus;
                            annotation.imgSrc = 'comment.png';
                            if('W'== annotation.type)
                                annotation.imgSrc = 'images/risk_warning.png';
                            else if('A'== annotation.type)
                                annotation.imgSrc = 'images/risk_alert.png';
                            annotations.push(annotation);
                        }
                        self.selectedAnotations(annotations);
                        self.dataPointsMarked(self.dataPointsMarked() + ' with ' + annotations.length + ' annotation(s)');
                   
                };
                
                function matchSeriesIndexByItemValue(item) {
                    var series = self.seriesValue();
                    for(var i = 0; i < series.length; i++) {
                        for(var j = 0; j < series[i].items.length; j++) {
                            if(series[i].items[j].id === item.id)
                                return j;
                        }
                    }
                    return -1;
                }
                
                var containsAlert = function(item) {
                    for(var i=0; i<item.assessmentObjects.length; i++) {
                        if('A'===item.assessmentObjects[i].riskStatus)
                            return true;
                    }
                    return false;
                }
                
                var containsWarning = function(item) {
                    for(var i=0; i<item.assessmentObjects.length; i++) {
                        if('W'===item.assessmentObjects[i].riskStatus)
                            return true;
                    }
                    return false;
                }
                
                self.initialAssessments = ko.observableArray([]);
                var loadAssessments = function (ids) {
                    var idsArray = JSON.stringify(ids);
                    return $.postJSON(ASSESSMENTS_FOR_DATA_POINTS, idsArray, function (assesments) {
                        //insert to quick read later on mouse over popup
                        self.initialAssessments(assesments);
                        
                        var annotationsSerieAlerts = Serie.produceAlert();
                        var annotationsSerieWarnings = Serie.produceWarning();
                        var annotationsSerieComments = Serie.produceComment();
                        
                        var serieAlertsItems = [];
                        var serieWarningsItems = [];
                        var serieCommentsItems = [];
                        
                        for (var i = 0; i < assesments.length; i++) {
                            var assesment = assesments[i];
                            if (assesment) {
                                for (var j = 0; j < assesment.assessedGefValueSets.length; j++) {
                                    var assessedGefValueSet = assesment.assessedGefValueSets[j];
                                    var geriatricFactorValue = assessedGefValueSet.geriatricFactorValue;
                                    var gefValue = geriatricFactorValue.gefValue;
                                    var id = geriatricFactorValue.id;
                                    var item = new Item();
                                    item.id = id;
                                    item.value = gefValue;
                                    item.assessmentObjects.push(assesments[i]);
                                    var matchedIndex = matchSeriesIndexByItemValue(item);
                                    if(matchedIndex>=0) {
                                        if(containsAlert(item)) {
                                            serieAlertsItems[matchedIndex] = item;
                                        }
                                        else if(containsWarning(item)) {
                                            serieWarningsItems[matchedIndex] = item;
                                        }
                                        else {
                                            serieCommentsItems[matchedIndex] = item;
                                        }
                                    }
                                }
                            }
                        }
                        
                        annotationsSerieAlerts.items = serieAlertsItems;
                        annotationsSerieWarnings.items = serieWarningsItems;
                        annotationsSerieComments.items = serieCommentsItems;
                        
                        self.seriesValue.push(annotationsSerieAlerts);
                        self.seriesValue.push(annotationsSerieWarnings);
                        self.seriesValue.push(annotationsSerieComments);
                    });
                };
                
                // Page handlers and intern functions
                self.handleActivated = function (info) {
                    var response = loadDataSet();
                    return response;
                };
                
                /*Mouse handles .. should be deleted when we found better way to fix popup position */
                var clientX;
                var clientY;
                $(document).mouseover(function (e) {
                    clientX = e.clientX;
                    clientY = e.clientY;
                });
                
                /* Period filter */
                self.val = ko.observableArray(["Month"]);
                
                /*Motility morphology - line chart*/
                // Chart values and selections
                self.orientationValue = ko.observable('vertical');
                self.groupsValue = ko.observableArray();
                self.seriesValue = ko.observableArray();
                self.dataPointsMarked = ko.observable('No data points marked.');
                self.selectedAnotations = ko.observableArray();
                self.dataPointsMarkedIds = ko.observableArray();
                
                function showAnnotationsPopup() {
                    $('#popup1').ojPopup("option", "position", {} );
                    $('#popup1').ojPopup('open');
                    $("#popup1").ojPopup("widget").css("left", clientX + 2  + "px");
                    $("#popup1").ojPopup("widget").css("top", clientY + 2 + "px");
                }
                /**
                 * 
                 * @param {type} dataSelection this is ui['optionMetadata'] for selected value(s)
                 * @returns {Array} Array of id-s for selected points of chart. <br/>
                 * In case that only selected one point of Assessment serie <br/>
                 * return will be Array of Assessment regarding selected point
                 */
                function filteredSelectionBetweenAssessmentSeriesAndOtherPoints(dataSelection) {
                    var filteredSelection = [];
                    //add all anotation if choosed only one point and if is from Assesments series
                    if( dataSelection.selectionData.length === 1 && dataSelection.selectionData[0].seriesData.name==='Assesments'){
                        filteredSelection.push(dataSelection.selectionData[0].data.assessmentObjects);
                        return filteredSelection;
                    }
                    //if selected more than one
                    for (var i=0;i<dataSelection.selectionData.length;i++) {
                        var selectedDataPoint = dataSelection.selectionData[i];
                        //skip assessment
                        if(selectedDataPoint.seriesData.name==='Assesments'){
                            
                        }
                        else {
                            filteredSelection.push(selectedDataPoint.data.id);
                        }
                        
                    }
                    return filteredSelection;
                }

                function calculateQueryParamsFromSelection(selectedPoints) {
                    var queryParams = '';
                    var i = 0;
                    var idsArray = [];
                    for (var i=0;i<selectedPoints.length;i++) {
                        if(i===0)
                            queryParams += 'sv'+i+'='+selectedPoints[i];
                        else
                            queryParams += '&sv'+i+'='+selectedPoints[i];
                        idsArray.push(selectedPoints[i]);
                    }
                    self.dataPointsMarkedIds(idsArray);
                    return queryParams === '' ? queryParams : '?' + queryParams;
                }

                function calculateSelectedIds(selectedPoints) {
                    var i = 0;
                    var idsArray = [];
                    for (var i=0;i<selectedPoints.length;i++) {
                        idsArray.push(selectedPoints[i]);
                    }
                    self.dataPointsMarkedIds(idsArray);
                    return idsArray;
                } 

                self.chartOptionChange = function (event, ui) {
                    if (ui['option'] === 'selection') {
                        if (ui['value'].length > 0) {
                            $('#popup1').ojPopup();
                            if($('#popup1').ojPopup( "isOpen" ))
                                $('#popup1').ojPopup('close');
                            // Avoid assesment selections as points
                            var onlyDataPoints = filteredSelectionBetweenAssessmentSeriesAndOtherPoints(ui['optionMetadata']);
                            if(onlyDataPoints.length === 1 && onlyDataPoints[0][0] && onlyDataPoints[0][0].id ){
                                self.dataPointsMarked('1 data point marked ');
                                loadCachedAnnotations(onlyDataPoints);
                            }else{
                                // Compose selections in get query parameters
                                var queryParams = calculateSelectedIds(onlyDataPoints);
                                self.dataPointsMarked(onlyDataPoints.length
                                    + ' data points marked ');
                                loadAnnotations(queryParams);
                            }
                            showAnnotationsPopup();
                        }
                    }
                };
                
                self.subFactorName = ko.observable('SubFactorNameFromPrevView');
                /* */
                self.min = ko.observable(10000);
                self.max = ko.observable(20000);
                self.step = ko.observable(1);
                self.valueArray = ko.observableArray([0, 0]);
                
                /* Show popup dialog for adding new annotation */
                self.clickShowPopupAddAnnotation = function (data, event) {
                    $('#dialog1').ojDialog();
                    $('#dialog1').ojDialog('open');
                    return true;
                };
                
                var postAnnotationCallback = function(data) {
                    console.log(data);
                    $('#dialog1').ojDialog('close');
                    //TODO: reload only assessments
                    loadDataSet();
                };
                
                /* ojButton postAnnotation */
                self.postAnnotation = function (data, event) {
                    //should be logged user ID
                    var authorId = 1;
                    var comment = ko.toJS(self.commentText);
                    var riskStatus = ko.toJS(self.selectedRiskStatus)[0];
                    var dataValidityStatus = ko.toJS(self.selectedDataValidity)[0];
                    var geriatricFactorValueIds = ko.toJS(self.dataPointsMarkedIds);
                    //TODO: should be get from miltiselect combobox for role
                    var audienceIds = ko.toJS(self.selectedRoles);
                    var annotationToPost = new AddAssesment
                        (authorId, comment, riskStatus, dataValidityStatus, geriatricFactorValueIds, audienceIds);
                    var jqXHR = $.postJSON(ASSESSMENTS_ADD_FOR_DATA_POINTS, 
                        JSON.stringify(annotationToPost),
                        postAnnotationCallback
                    );
                    jqXHR.fail(serverErrorCallback);
                    return true;
                };

                 // Add assesment popup
                self.commentText = ko.observable('');
                
                /* Risks select */
                self.riskStatusesURL = CODELIST_SELECT_ALL_RISKS;
                self.risksCollection = ko.observable();
                self.risksTags = ko.observableArray([]);       
                self.selectedRiskStatus = ko.observable();

                parseRisks = function (response) {
                    return {
                        riskStatus: response['riskStatus'],
                        riskStatusDesc: response['riskStatusDescription'],
                        imagePath: response['imagePath']};
                };
                
                var collectionRisks = new oj.Collection.extend({
                    url: self.riskStatusesURL,
                    fetchSize: -1,
                    model: new oj.Model.extend({
                        idAttribute: 'riskStatus',
                        parse: parseRisks
                    })
                });
                
                self.risksCollection(new collectionRisks());
                self.risksCollection().fetch({
                    success: function (collection, response, options) {
                        if(self.risksTags.length === 0) {
                            for (var i = 0; i < collection.size(); i++) {
                                var riskModel = collection.at(i);
                                self.risksTags.push({value: riskModel.attributes.riskStatus, label: riskModel.attributes.riskStatusDesc, imagePath: riskModel.attributes.imagePath});
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
                /* End Risks select */
                
                /* Data validities */
                //self.dataValiditiesCollection = ko.observable();
                self.dataValiditiesTags = ko.observableArray([ { value: 'QUESTIONABLE_DATA', label: 'Questionable data' ,  imagePath: 'images/questionable_data.png' },
                                                            { value: 'FAULTY_DATA', label: 'Faulty data' ,  imagePath: 'images/faulty_data.png' },
                                                         { value: 'VALID_DATA', label: 'Valid data' ,  imagePath: 'images/valid_data.png' }]);       
                self.selectedDataValidity = ko.observable();

//                parseDataValidities = function (response) {
//                    return {
//                        dataValidity: response['dataValidity'],
//                        dataValidityDesc: response['dataValidityDesc'],
//                        imagePath: response['imagePath']};
//                };
//                
//                var collectionDataValidities = new oj.Collection.extend({
//                    url: OJ_CODE_BOOK_SELECT_ALL_DATA_VALIDITIES,
//                    fetchSize: -1,
//                    model: new oj.Model.extend({
//                        idAttribute: 'dataValidity',
//                        parse: parseDataValidities
//                    })
//                });
//                
//                self.dataValiditiesCollection(new collectionDataValidities());
//                self.dataValiditiesCollection().fetch({
//                    success: function (collection, response, options) {
//                        if(self.dataValiditiesTags.length === 0) {
//                            for (var i = 0; i < collection.size(); i++) {
//                                var dataValidityModel = collection.at(i);
//                                self.dataValiditiesTags.push({value: dataValidityModel.attributes.dataValidity, label: dataValidityModel.attributes.dataValidityDesc, imagePath: dataValidityModel.attributes.imagePath});
//                            }
//                        }
//                    },
//                    error: function (jqXHR, textStatus, errorThrown) {
//                    }
//                });
                /* End Data validities */
                
                /* Audience ids -> CdRole*/
                self.rolesForStakeHoldersURL = CODELIST_SELECT_ROLES_FOR_STAKEHOLDER;
                self.rolesCollection = ko.observable();
                self.roleTags = ko.observableArray([]);       
                self.selectedRoles = ko.observableArray();

                var role = new oj.Collection.extend({
                    url: self.rolesForStakeHoldersURL,
                    fetchSize: -1,
                    model: new oj.Model.extend({
                        idAttribute: 'id',
                        parse: function(response){
                             return response.result;
                        }
                    })
                });
                self.rolesCollection(new role());
                self.rolesCollection().fetch({
                    data: "{\"stakeholderAbbr\":\"GES\"}", 
                    type: 'POST',
                    success: function (collection, response, options) {
                        if(self.roleTags.length === 0) {
                            for (var i = 0; i < response.length; i++) {
                                var roleModel = response[i];
                                self.roleTags.push({value: roleModel.id, label: roleModel.roleName});
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
               
                
                
                self.audienceIds = ko.observableArray([
                    {id : "Caregiver", name : "Caregiver"},
                    {id : "Geriatrician", name : "Geriatrician"},
                    {id : "Intervention staff", name : "Intervention staff"},
                    {id : "City 4 Age staff", name : "City 4 Age staff"}
                ]);
                self.selectedAudienceIds = ko.observableArray();
                
                /* End Audience ids */
                
                self.shownFilterBar = false;
                self.toggleFilterAnnotationBar = function (e) {

                    if ($('#annotation-filter').css('display') === 'none') {
                        $('#annotation-filter').css({display: 'block'});
                        self.shownFilterBar = true;
                    } else {
                        $('#annotation-filter').css({display: 'none'});
                        self.shownFilterBar = false;
                    }
                };
                self.searchInput = function () {};
                self.valRole = ko.observableArray(["Caregiver"]);
//                self.valType = ko.observableArray(["Warning"]);

//                self.currentRawValue = ko.observable();
                self.nowrap = ko.observable(false);
//                self.handleTransitionCompleted = function (info) {
//                    $("#oj-inputsearch-choice-search-input").css("height", "42px");
//                    $("#oj-select-choice-selectSort").css("height", "42px");
//                };

                self.formats = ko.observableArray();
                self.isChecked = ko.observable();
                self.checkedFilterRiskStatus = ko.observableArray();
                self.checkedFilterValidityData = ko.observableArray();
                
                /* polar chart - uradjen za prvu grupu i to za mesece M1, M2 i M5 */
                var groups = ["Initial", "Jan 2016", "Feb 2016", "Mar 2016", "Apr 2016", "May 2016", "Jun 2016", "Jul 2016", "Avg 2016", "Sep 2016", "Oct 2016", "Nov 2016", "Dec 2016"];
                 var series = [{name: "Walking", items: [3.0, 1.5, 1.0, 2.2, 1.8, 3.1, 3.0, 3.6, 2.0, 2.5, 1.5, 3.8, 4.4]},
                   {name: "Climbing stairs", items: [3.0, 4.2, 2.8, 2.2, 3.3, 2.8, 2.8, 1.9, 2.5, 3.4, 4.1, 2.7, 2.3]},
                   {name: "Still/Moving", items: [3.0, 5.0, 3.7, 4.6, 4.5, 5.0, 4.8, 4.4, 3.9, 3.9, 5.0, 5.0, 5.0]},
                   {name: "Moving across rooms", items: [3.0, 3.3, 3.8, 5.0, 4.5, 3.9, 3.7, 3.5, 4.1, 4.0, 3.6, 5.0, 4.5]},
                   {name: "Gait balance", items: [3.0, 2.8, 2.8, 3.2, 2.9, 3.3, 2.7, 2.5, 3.0, 1.9, 2.3, 1.8, 2.6]},
                   {name: "Alerts", color: '#e83d17', source: "images/alert.png", items: [null, 1.5, 1.0, null, null, null, null, null, null, null, 1.5, null, null], lineType: 'none', markerDisplayed: 'on', markerSize: 20},
                   {name: "Warnings", color: '#ffff66', source: "images/warning-icon.png", items: [null, null, null, null, 1.8, null, null, 1.9, null, 1.9, null, 1.8, null], lineType: 'none', markerDisplayed: 'on', markerSize: 20},
                   {name: "Comments", color: '#ebebeb', source: "images/comment-gray.png", items: [null, null, 2.8, null, null, null, null, null, null, null, null, 2.7, null], lineType: 'none', markerDisplayed: 'on', markerSize: 20}];
                var lineSeriesPolar = [{name: groups[1], items: [series[0].items[1], series[1].items[1], series[2].items[1], series[3].items[1], series[4].items[1]], color: '#ED6647'},
                    {name: groups[2], items: [series[0].items[2], series[1].items[2], series[2].items[2], series[3].items[2], series[4].items[2]], color: '#8561C8'},
                    {name: groups[5], items: [series[0].items[5], series[1].items[5], series[2].items[5], series[3].items[5], series[4].items[5]], color: '#6DDBDB'}];
                var series1 = [{name: "Walking", items: [3.0, 1.5, 1.0, 2.2, 1.8, 3.1, 3.0, 3.6, 2.0, 2.5, 1.5, 3.8, 4.4]},
                    {name: "Climbing stairs", items: [3.0, 4.2, 2.8, 2.2, 3.3, 2.8, 2.8, 1.9, 2.5, 3.4, 4.1, 2.7, 2.3]},
                    {name: "Still/Moving", items: [3.0, 5.0, 3.7, 4.6, 4.5, 5.0, 4.8, 4.4, 3.9, 3.9, 5.0, 5.0, 5.0]},
                    {name: "Moving across rooms", items: [3.0, 3.3, 3.8, 5.0, 4.5, 3.9, 3.7, 3.5, 4.1, 4.0, 3.6, 5.0, 4.5]},
                    {name: "Gait balance", items: [3.0, 2.8, 2.8, 3.2, 2.9, 3.3, 2.7, 2.5, 3.0, 1.9, 2.3, 1.8, 2.6]}];
                var lineGroupsPolar = series1; //grupe su nazivi serija linijskog dijagrama bez alerta

                self.stackValue = ko.observable('off');
                self.typeValue = ko.observable('line');
                self.polarGridShapeValue = ko.observable('polygon');
                self.polarChartSeriesValue = ko.observableArray(lineSeriesPolar);
                self.polarChartGroupsValue = ko.observableArray(lineGroupsPolar);
            }

            return new detectionGesContentViewModel();
        });
