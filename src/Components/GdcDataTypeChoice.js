import React, { useState, useEffect } from 'react'
import GdcWorkflowChoice from './GdcWorkflowChoice'
import { Form } from 'react-bootstrap'
import '../App.css'

export default function GdcDataTypeChoice(props) {
	const [gdcDataTypes, setGdcDataTypes] = useState([])
	const [uniqueDataType, setUniqueDataType] = useState([])
	const [selectedType, setSelectedType] = useState([])
	const [showWorkflow, setShowWorkflow] = useState(false)

	function getGdcDataTypes() {
		fetch('https://api.gdc.cancer.gov/v0/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: `
                query DataTypeFileCounts($filters: FiltersArgument) {
                    viewer {
                        repository {
                    files {
                          hits(first: 1000, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
                            data_type
                            
                            }
                        }
                    } }
                   }}
                      }`,
				variables: {
					filters: {
						op: 'and',
						content: [
							{
								op: 'in',
								content: {
									field: 'cases.project.project_id',
									value: props.project,
								},
							},
							{
								op: 'in',
								content: {
									field: 'data_category',
									value: props.category,
								},
							},
						],
					},
				},
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				setGdcDataTypes(res.data.viewer.repository.files.hits.edges)
			})
	}

	useEffect(() => {
		getGdcDataTypes()
	}, [props.category])

	useEffect(() => {
		showDataTypes()
	}, [gdcDataTypes])

	function showDataTypes() {
		let helperSet = new Set()
		gdcDataTypes.map((dataType) => helperSet.add(dataType.node.data_type))

		setUniqueDataType(Array.from(helperSet))
	}

	const handleChange = (e) => {
		const selection = e.target.name
		let previousSelection = selectedType

		if (e.target.checked) {
			previousSelection.push(selection)
		} else {
			const index = selectedType.indexOf(selection)
			previousSelection.splice(index, 1)
		}
		setSelectedType(previousSelection)
		setShowWorkflow(true)
		console.log(selectedType)
	}

	return (
		<>
			<div>
				{uniqueDataType ? (
					<Form>
						{uniqueDataType.map((type) => (
							<Form.Group controlId='formBasicCheckbox'>
								<Form.Check
									type='checkbox'
									name={type}
									label={type}
									onChange={handleChange}
								/>
							</Form.Group>
						))}
					</Form>
				) : (
					<h1>loading available GDC data types...</h1>
				)}
			</div>
			<div>
				{showWorkflow && (
					<>
						<GdcWorkflowChoice
							dataType={selectedType}
							category={props.category}
							project={props.project}
						/>
					</>
				)}
			</div>
		</>
	)
}